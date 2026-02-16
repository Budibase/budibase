import fetch from "node-fetch"
import { v4 } from "uuid"
import {
  context,
  db as dbCore,
  docIds,
  HTTPError,
} from "@budibase/backend-core"
import { DiscordCommands } from "@budibase/shared-core"
import type {
  ChatApp,
  ChatConversation,
  ChatConversationChannel,
  ChatConversationRequest,
  ContextUser,
  Ctx,
  DiscordCommand,
  DiscordConversationScope,
  DiscordInteraction,
  DiscordInteractionComponent,
} from "@budibase/types"
import { DocumentType } from "@budibase/types"
import sdk from "../../../sdk"
import {
  discordChat,
  prepareChatConversationForSave,
  truncateTitle,
} from "../ai/chatConversations"

const DISCORD_API_BASE_URL = "https://discord.com/api/v10"
const DISCORD_SIGNATURE_HEADER = "x-signature-ed25519"
const DISCORD_TIMESTAMP_HEADER = "x-signature-timestamp"
const DISCORD_INTERACTION_PING = 1
const DISCORD_INTERACTION_APPLICATION_COMMAND = 2
const DISCORD_INTERACTION_MODAL_SUBMIT = 5
const DISCORD_INTERACTION_CALLBACK_MESSAGE = 4
const DISCORD_INTERACTION_CALLBACK_DEFERRED_MESSAGE = 5
const DISCORD_ASK_COMMAND = DiscordCommands.ASK
const DISCORD_NEW_COMMAND = DiscordCommands.NEW
const DISCORD_DEFAULT_IDLE_TIMEOUT_MINUTES = 45
const DISCORD_DEFAULT_CONVERSATION_CACHE_SIZE = 5000
const DISCORD_FALLBACK_ERROR_MESSAGE =
  "Sorry, something went wrong while processing your request."

const discordConversationCache = new Map<string, string>()

const getRawBody = (ctx: Ctx<any, any>) => {
  const body = ctx.request.body as Record<string, any>
  const unparsedBody = body?.[Symbol.for("unparsedBody") as any]
  if (Buffer.isBuffer(unparsedBody)) {
    return unparsedBody.toString("utf8")
  }
  if (typeof unparsedBody === "string") {
    return unparsedBody
  }
  return JSON.stringify(ctx.request.body ?? {})
}

const extractModalComponentValues = (
  components: DiscordInteractionComponent[] = []
): string[] =>
  components.flatMap(c => [
    ...(typeof c.value === "string" && c.value.trim() ? [c.value.trim()] : []),
    ...extractModalComponentValues(c.components || []),
  ])

export const extractDiscordContent = (interaction: DiscordInteraction) => {
  const optionValues = (interaction.data?.options || [])
    .map(o => (o.value != null ? String(o.value) : ""))
    .filter(Boolean)

  const modalValues = extractModalComponentValues(interaction.data?.components)

  return [...optionValues, ...modalValues].join(" ").trim()
}

export const getDiscordInteractionCommand = (
  interaction: DiscordInteraction
): DiscordCommand => {
  const rawName = interaction.data?.name?.trim().toLowerCase() || ""

  if (rawName === DISCORD_NEW_COMMAND) return DiscordCommands.NEW
  if (rawName === DISCORD_ASK_COMMAND) return DiscordCommands.ASK
  if (interaction.type === DISCORD_INTERACTION_MODAL_SUBMIT || !rawName) {
    return DiscordCommands.ASK
  }
  return DiscordCommands.UNSUPPORTED
}

const buildDiscordUserContext = (
  userId: string,
  displayName?: string
): ContextUser => ({
  _id: `discord:${userId}`,
  tenantId: context.getTenantId(),
  email: `discord+${userId}@example.invalid`,
  roles: {},
  userId,
  firstName: displayName,
})

const splitDiscordMessage = (content: string, maxLength = 2000): string[] => {
  if (content.length <= maxLength) return [content]
  const chunks: string[] = []
  for (let i = 0; i < content.length; i += maxLength) {
    chunks.push(content.slice(i, i + maxLength))
  }
  return chunks
}

const sendDiscordRequest = async ({
  method,
  url,
  content,
}: {
  method: "PATCH" | "POST"
  url: string
  content: string
}) => {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content,
      allowed_mentions: { parse: [] },
    }),
  })
  if (!response.ok) {
    throw new Error(
      `Discord followup failed (${response.status}): ${response.statusText}`
    )
  }
}

const sendDiscordResponse = async (
  applicationId: string,
  token: string,
  content: string
) => {
  const chunks = splitDiscordMessage(content || "No response generated.")
  const originalUrl = `${DISCORD_API_BASE_URL}/webhooks/${applicationId}/${token}/messages/@original`
  const followupUrl = `${DISCORD_API_BASE_URL}/webhooks/${applicationId}/${token}`
  const firstChunk = chunks[0] || "No response generated."
  const remainingChunks = chunks.slice(1)

  await sendDiscordRequest({
    method: "PATCH",
    url: originalUrl,
    content: firstChunk,
  })

  for (const chunk of remainingChunks) {
    await sendDiscordRequest({
      method: "POST",
      url: followupUrl,
      content: chunk,
    })
  }
}

const getDiscordErrorMessage = (error: unknown) =>
  error instanceof HTTPError ? error.message : DISCORD_FALLBACK_ERROR_MESSAGE

const sendDiscordErrorResponse = async ({
  interaction,
  error,
}: {
  interaction: DiscordInteraction
  error: unknown
}) => {
  try {
    await sendDiscordResponse(
      interaction.application_id,
      interaction.token,
      getDiscordErrorMessage(error)
    )
  } catch (responseError) {
    console.error("Failed to send Discord fallback response", responseError)
  }
}

const toSortTimestamp = (chat: ChatConversation): number => {
  const latest = chat.updatedAt || chat.createdAt
  if (!latest) return 0
  const parsed = new Date(latest).getTime()
  return Number.isFinite(parsed) ? parsed : 0
}

export const isDiscordConversationExpired = ({
  chat,
  idleTimeoutMs,
  nowMs = Date.now(),
}: {
  chat: ChatConversation
  idleTimeoutMs: number
  nowMs?: number
}) => {
  if (idleTimeoutMs <= 0) return false
  const lastActivity = toSortTimestamp(chat)
  if (!lastActivity) return false
  return nowMs - lastActivity > idleTimeoutMs
}

export const getDiscordIdleTimeoutMs = () => {
  const configured = Number(
    process.env.DISCORD_CONVERSATION_IDLE_TIMEOUT_MINUTES
  )
  const minutes =
    Number.isFinite(configured) && configured > 0
      ? configured
      : DISCORD_DEFAULT_IDLE_TIMEOUT_MINUTES
  return minutes * 60 * 1000
}

export const isDiscordTimestampFresh = (
  timestamp: string,
  nowMs = Date.now()
) => sdk.ai.deployments.discord.isDiscordTimestampFresh(timestamp, nowMs)

const getDiscordConversationCacheSize = () => {
  const configured = Number(process.env.DISCORD_CONVERSATION_CACHE_SIZE)
  if (Number.isFinite(configured) && configured > 0) {
    return Math.floor(configured)
  }
  return DISCORD_DEFAULT_CONVERSATION_CACHE_SIZE
}

const getDiscordConversationCacheKey = ({
  workspaceId,
  scope,
}: {
  workspaceId: string
  scope: DiscordConversationScope
}) =>
  [
    workspaceId,
    scope.chatAppId,
    scope.agentId,
    scope.channelId,
    scope.threadId || "",
    scope.externalUserId,
  ].join(":")

const setDiscordConversationCache = (cacheKey: string, chatId: string) => {
  if (!chatId) {
    return
  }
  if (discordConversationCache.has(cacheKey)) {
    discordConversationCache.delete(cacheKey)
  }
  discordConversationCache.set(cacheKey, chatId)

  const maxSize = getDiscordConversationCacheSize()
  while (discordConversationCache.size > maxSize) {
    const firstKey = discordConversationCache.keys().next().value
    if (!firstKey) {
      break
    }
    discordConversationCache.delete(firstKey)
  }
}

export const matchesDiscordConversationScope = ({
  chat,
  scope,
}: {
  chat: ChatConversation
  scope: DiscordConversationScope
}) => {
  const ch = chat.channel
  if (
    chat.chatAppId !== scope.chatAppId ||
    chat.agentId !== scope.agentId ||
    ch?.provider !== "discord" ||
    ch?.channelId !== scope.channelId ||
    (ch?.threadId || undefined) !== scope.threadId
  ) {
    return false
  }

  if (ch?.externalUserId) {
    return ch.externalUserId === scope.externalUserId
  }
  return chat.userId === `discord:${scope.externalUserId}`
}

export const pickDiscordConversation = ({
  chats,
  scope,
  idleTimeoutMs,
  nowMs = Date.now(),
}: {
  chats: ChatConversation[]
  scope: DiscordConversationScope
  idleTimeoutMs: number
  nowMs?: number
}) =>
  chats
    .filter(
      chat =>
        matchesDiscordConversationScope({ chat, scope }) &&
        !isDiscordConversationExpired({ chat, idleTimeoutMs, nowMs })
    )
    .sort((a, b) => toSortTimestamp(b) - toSortTimestamp(a))[0]

const findDiscordConversation = async ({
  db,
  workspaceId,
  scope,
  idleTimeoutMs,
}: {
  db: ReturnType<typeof context.getWorkspaceDB>
  workspaceId: string
  scope: DiscordConversationScope
  idleTimeoutMs: number
}) => {
  const cacheKey = getDiscordConversationCacheKey({ workspaceId, scope })
  const cachedChatId = discordConversationCache.get(cacheKey)
  if (cachedChatId) {
    const cachedChat = await db.tryGet<ChatConversation>(cachedChatId)
    if (
      cachedChat &&
      matchesDiscordConversationScope({ chat: cachedChat, scope }) &&
      !isDiscordConversationExpired({ chat: cachedChat, idleTimeoutMs })
    ) {
      setDiscordConversationCache(cacheKey, cachedChatId)
      return cachedChat
    }
    discordConversationCache.delete(cacheKey)
  }

  /*
  Concerned about this, but will revisit when more channels get added,
  How many chat convos could a workspace end up having? 09/02/2026
  Also a problem in general chat convo fetching
  */
  const response = await db.allDocs<ChatConversation>(
    docIds.getDocParams(DocumentType.CHAT_CONVERSATION, undefined, {
      include_docs: true,
    })
  )

  const chats = response.rows
    .map(row => row.doc)
    .filter((chat): chat is ChatConversation => !!chat)

  const picked = pickDiscordConversation({ chats, scope, idleTimeoutMs })
  if (picked?._id) {
    setDiscordConversationCache(cacheKey, picked._id)
  }
  return picked
}

const getIdleTimeoutMs = (configMinutes?: number) => {
  if (configMinutes && configMinutes > 0) {
    return configMinutes * 60 * 1000
  }
  return getDiscordIdleTimeoutMs()
}

const handleDiscordInteraction = async ({
  interaction,
  instance,
  chatAppId,
  agentId,
}: {
  interaction: DiscordInteraction
  instance: string
  chatAppId: string
  agentId: string
}) => {
  const prodAppId = dbCore.getProdWorkspaceID(instance)
  const { application_id, token } = interaction

  const reply = (content: string) =>
    sendDiscordResponse(application_id, token, content)

  await context.doInWorkspaceContext(prodAppId, async () => {
    const db = context.getWorkspaceDB()
    const chatApp = await db.tryGet<ChatApp>(chatAppId)
    if (!chatApp) {
      return reply("Chat app not found.")
    }

    if (
      !chatApp.agents?.some(
        agent => agent.agentId === agentId && agent.isEnabled
      )
    ) {
      return reply("Agent is not enabled for this chat app.")
    }

    const agentConfig = await sdk.ai.agents.getOrThrow(agentId)
    const discord = agentConfig.discordIntegration
    const askName = DISCORD_ASK_COMMAND
    const newName = DISCORD_NEW_COMMAND
    const command = getDiscordInteractionCommand(interaction)
    if (command === DiscordCommands.UNSUPPORTED) {
      return reply(
        `Use /${askName} with a message to chat, or /${newName} to start a new conversation.`
      )
    }

    const user = interaction.member?.user || interaction.user
    const userId = user?.id || "unknown"
    const displayName = user?.global_name || user?.username
    const channelId = interaction.channel_id
    if (!channelId) {
      return reply("Missing Discord channel information.")
    }

    const threadId = interaction.thread_id
    const content = extractDiscordContent(interaction)

    const channel: ChatConversationChannel = {
      provider: "discord",
      channelId,
      threadId,
      guildId: interaction.guild_id,
      externalUserId: userId,
      externalUserName: displayName,
    }

    const scope: DiscordConversationScope = {
      chatAppId,
      agentId,
      channelId,
      threadId,
      externalUserId: userId,
    }

    if (command === DiscordCommands.NEW && !content) {
      const chatId = docIds.generateChatConversationID()
      await db.put(
        prepareChatConversationForSave({
          chatId,
          chatAppId,
          userId: `discord:${userId}`,
          title: "New conversation",
          messages: [],
          chat: {
            _id: chatId,
            chatAppId,
            agentId,
            title: "New conversation",
            messages: [],
            channel,
          },
        })
      )
      setDiscordConversationCache(
        getDiscordConversationCacheKey({ workspaceId: prodAppId, scope }),
        chatId
      )
      return reply(
        `Started a new conversation. Use /${askName} with a message.`
      )
    }

    if (!content) {
      return reply(`Please provide a message after /${askName}.`)
    }

    const existingChat =
      command === DiscordCommands.NEW
        ? undefined
        : await findDiscordConversation({
            db,
            workspaceId: prodAppId,
            scope,
            idleTimeoutMs: getIdleTimeoutMs(discord?.idleTimeoutMinutes),
          })

    const userMessage: ChatConversationRequest["messages"][number] = {
      id: v4(),
      role: "user",
      parts: [{ type: "text", text: content }],
    }

    const draftChat: ChatConversationRequest = {
      _id: existingChat?._id,
      chatAppId,
      agentId,
      title: existingChat?.title || truncateTitle(content),
      messages: [...(existingChat?.messages || []), userMessage],
      channel,
    }

    let result: Awaited<ReturnType<typeof discordChat>>
    try {
      result = await discordChat({
        chat: draftChat,
        user: buildDiscordUserContext(userId, displayName),
      })
    } catch (error) {
      const message = getDiscordErrorMessage(error)
      return reply(message)
    }

    const chatId = existingChat?._id ?? docIds.generateChatConversationID()
    await db.put(
      prepareChatConversationForSave({
        chatId,
        chatAppId,
        userId: `discord:${userId}`,
        title: existingChat?.title || result.title,
        messages: result.messages,
        chat: { ...draftChat, _id: chatId },
        existingChat,
      })
    )
    setDiscordConversationCache(
      getDiscordConversationCacheKey({ workspaceId: prodAppId, scope }),
      chatId
    )

    await reply(result.assistantText || "No response generated.")
  })
}

export async function discordWebhook(
  ctx: Ctx<any, any, { instance: string; chatAppId: string; agentId: string }>
) {
  const prodAppId = dbCore.getProdWorkspaceID(ctx.params.instance)
  if (ctx.params.instance !== prodAppId) {
    ctx.status = 400
    ctx.body = {
      error: "Discord webhook must target a production workspace ID",
    }
    return
  }

  const signature = ctx.headers[DISCORD_SIGNATURE_HEADER]
  const timestamp = ctx.headers[DISCORD_TIMESTAMP_HEADER]

  if (
    !signature ||
    !timestamp ||
    Array.isArray(signature) ||
    Array.isArray(timestamp)
  ) {
    ctx.status = 401
    ctx.body = { error: "Missing Discord signature headers" }
    return
  }

  const rawBody = getRawBody(ctx)
  if (!isDiscordTimestampFresh(timestamp)) {
    ctx.status = 401
    ctx.body = { error: "Invalid Discord signature timestamp" }
    return
  }

  let publicKey: string
  try {
    publicKey = await sdk.ai.deployments.discord.getDiscordPublicKeyForRoute({
      instance: ctx.params.instance,
      agentId: ctx.params.agentId,
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      ctx.status = error.status
      ctx.body = { error: error.message }
      return
    }
    throw error
  }

  if (
    !sdk.ai.deployments.discord.verifyDiscordSignature({
      publicKey,
      signature,
      timestamp,
      rawBody,
    })
  ) {
    ctx.status = 401
    ctx.body = { error: "Invalid Discord signature" }
    return
  }

  const interaction = ctx.request.body as DiscordInteraction
  if (interaction?.type === DISCORD_INTERACTION_PING) {
    ctx.status = 200
    ctx.body = { type: DISCORD_INTERACTION_PING }
    return
  }

  if (
    interaction?.type !== DISCORD_INTERACTION_APPLICATION_COMMAND &&
    interaction?.type !== DISCORD_INTERACTION_MODAL_SUBMIT
  ) {
    ctx.status = 200
    ctx.body = {
      type: DISCORD_INTERACTION_CALLBACK_MESSAGE,
      data: {
        content: "Unsupported interaction type.",
      },
    }
    return
  }

  ctx.status = 200
  ctx.body = { type: DISCORD_INTERACTION_CALLBACK_DEFERRED_MESSAGE }

  setImmediate(async () => {
    try {
      await handleDiscordInteraction({
        interaction,
        instance: ctx.params.instance,
        chatAppId: ctx.params.chatAppId,
        agentId: ctx.params.agentId,
      })
    } catch (error) {
      console.error("Discord webhook processing failed", error)
      await sendDiscordErrorResponse({ interaction, error })
    }
  })
}
