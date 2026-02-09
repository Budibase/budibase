import crypto from "crypto"
import fetch from "node-fetch"
import { v4 } from "uuid"
import {
  context,
  db as dbCore,
  docIds,
  HTTPError,
} from "@budibase/backend-core"
import type {
  ChatApp,
  ChatConversation,
  ChatConversationChannel,
  ChatConversationRequest,
  ContextUser,
  Ctx,
} from "@budibase/types"
import { DocumentType } from "@budibase/types"
import sdk from "../../../sdk"
import {
  agentChatComplete,
  prepareChatConversationForSave,
  truncateTitle,
} from "../ai/chatConversations"

const DISCORD_API_BASE_URL = "https://discord.com/api/v10"
const DISCORD_SIGNATURE_HEADER = "x-signature-ed25519"
const DISCORD_TIMESTAMP_HEADER = "x-signature-timestamp"
const DISCORD_INTERACTION_PING = 1
const DISCORD_INTERACTION_APPLICATION_COMMAND = 2
const DISCORD_INTERACTION_MODAL_SUBMIT = 5
const DISCORD_DEFAULT_IDLE_TIMEOUT_MINUTES = 45

interface DiscordUser {
  id: string
  username?: string
  global_name?: string
}

interface DiscordInteractionOption {
  name?: string
  value?: string | number | boolean
}

interface DiscordInteractionData {
  name?: string
  options?: DiscordInteractionOption[]
  components?: DiscordInteractionComponent[]
}

interface DiscordInteractionComponent {
  value?: string
  components?: DiscordInteractionComponent[]
}

export interface DiscordInteraction {
  id: string
  type: number
  token: string
  application_id: string
  channel_id?: string
  thread_id?: string
  guild_id?: string
  data?: DiscordInteractionData
  member?: { user?: DiscordUser }
  user?: DiscordUser
}

export interface DiscordConversationScope {
  chatAppId: string
  agentId: string
  channelId: string
  threadId?: string
  externalUserId: string
}

export type DiscordCommand = "ask" | "new" | "unsupported"

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

const verifyDiscordSignature = ({
  publicKey,
  signature,
  timestamp,
  rawBody,
}: {
  publicKey: string
  signature: string
  timestamp: string
  rawBody: string
}) => {
  const derPrefix = "302a300506032b6570032100"
  const key = crypto.createPublicKey({
    key: Buffer.from(`${derPrefix}${publicKey}`, "hex"),
    format: "der",
    type: "spki",
  })
  return crypto.verify(
    null,
    new Uint8Array(Buffer.from(`${timestamp}${rawBody}`)),
    key,
    new Uint8Array(Buffer.from(signature, "hex"))
  )
}

const extractModalComponentValues = (
  components: DiscordInteractionComponent[] = []
): string[] =>
  components.flatMap(c => [
    ...(typeof c.value === "string" && c.value.trim() ? [c.value.trim()] : []),
    ...extractModalComponentValues(c.components || []),
  ])

const normalizeCommandName = (
  value: string | undefined,
  fallback: "ask" | "new"
) => (value || fallback).trim().toLowerCase() || fallback

export const extractDiscordContent = (interaction: DiscordInteraction) => {
  const optionValues = (interaction.data?.options || [])
    .map(o => (o.value != null ? String(o.value) : ""))
    .filter(Boolean)

  const modalValues = extractModalComponentValues(interaction.data?.components)

  return [...optionValues, ...modalValues].join(" ").trim()
}

export const getDiscordInteractionCommand = (
  interaction: DiscordInteraction,
  options?: {
    askCommandName?: string
    newCommandName?: string
  }
): DiscordCommand => {
  const rawName = interaction.data?.name?.trim().toLowerCase() || ""
  const askName = normalizeCommandName(options?.askCommandName, "ask")
  const newName = normalizeCommandName(options?.newCommandName, "new")

  if (rawName === newName) return "new"
  if (rawName === askName) return "ask"
  if (interaction.type === DISCORD_INTERACTION_MODAL_SUBMIT || !rawName) {
    return "ask"
  }
  return "unsupported"
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

const sendDiscordFollowup = async (
  applicationId: string,
  token: string,
  content: string
) => {
  const url = `${DISCORD_API_BASE_URL}/webhooks/${applicationId}/${token}`
  for (const chunk of splitDiscordMessage(content)) {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: chunk }),
    })
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
  scope,
  idleTimeoutMs,
}: {
  scope: DiscordConversationScope
  idleTimeoutMs: number
}) => {
  const db = context.getWorkspaceDB()
  const response = await db.allDocs<ChatConversation>(
    docIds.getDocParams(DocumentType.CHAT_CONVERSATION, undefined, {
      include_docs: true,
    })
  )

  const chats = response.rows
    .map(row => row.doc)
    .filter((chat): chat is ChatConversation => !!chat)

  return pickDiscordConversation({ chats, scope, idleTimeoutMs })
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
    sendDiscordFollowup(application_id, token, content)

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
    const askName = normalizeCommandName(discord?.askCommandName, "ask")
    const newName = normalizeCommandName(discord?.newCommandName, "new")

    const command = getDiscordInteractionCommand(interaction, {
      askCommandName: askName,
      newCommandName: newName,
    })
    if (command === "unsupported") {
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

    if (command === "new" && !content) {
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
      return reply(
        `Started a new conversation. Use /${askName} with a message.`
      )
    }

    if (!content) {
      return reply(`Please provide a message after /${askName}.`)
    }

    const scope: DiscordConversationScope = {
      chatAppId,
      agentId,
      channelId,
      threadId,
      externalUserId: userId,
    }

    const existingChat =
      command === "new"
        ? undefined
        : await findDiscordConversation({
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

    let result: Awaited<ReturnType<typeof agentChatComplete>>
    try {
      result = await agentChatComplete({
        chat: draftChat,
        user: buildDiscordUserContext(userId, displayName),
      })
    } catch (error) {
      const message = error instanceof HTTPError ? error.message : "Agent error"
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

    await reply(result.assistantText || "No response generated.")
  })
}

export async function discordWebhook(
  ctx: Ctx<any, any, { instance: string; chatAppId: string; agentId: string }>
) {
  const signature = ctx.headers[DISCORD_SIGNATURE_HEADER]
  const timestamp = ctx.headers[DISCORD_TIMESTAMP_HEADER]
  const publicKey = ""

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
  if (!verifyDiscordSignature({ publicKey, signature, timestamp, rawBody })) {
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

  ctx.status = 200
  ctx.body = { type: 5 }

  if (
    interaction?.type !== DISCORD_INTERACTION_APPLICATION_COMMAND &&
    interaction?.type !== DISCORD_INTERACTION_MODAL_SUBMIT
  ) {
    return
  }

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
    }
  })
}
