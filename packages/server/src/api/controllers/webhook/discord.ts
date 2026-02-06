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

const createDiscordPublicKey = (publicKey: string) => {
  const derPrefix = "302a300506032b6570032100"
  return crypto.createPublicKey({
    key: Buffer.from(`${derPrefix}${publicKey}`, "hex"),
    format: "der",
    type: "spki",
  })
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
  const key = createDiscordPublicKey(publicKey)
  const message = new Uint8Array(Buffer.from(`${timestamp}${rawBody}`))
  const signatureBuffer = new Uint8Array(Buffer.from(signature, "hex"))
  return crypto.verify(null, message, key, signatureBuffer)
}

const extractModalComponentValues = (
  components: DiscordInteractionComponent[] = []
): string[] => {
  return components.flatMap(component => {
    const directValue =
      typeof component.value === "string" ? component.value.trim() : ""
    const nestedValues = extractModalComponentValues(component.components || [])
    return [...(directValue ? [directValue] : []), ...nestedValues]
  })
}

const normalizeDiscordCommandName = (
  value: string | undefined,
  fallback: "ask" | "new"
) => {
  const candidate = (value || fallback).trim().toLowerCase()
  return candidate || fallback
}

export const extractDiscordContent = (interaction: DiscordInteraction) => {
  const options = interaction.data?.options || []
  const optionText = options
    .map(option => (option.value != null ? String(option.value) : ""))
    .filter(Boolean)
    .join(" ")
    .trim()

  const modalText = extractModalComponentValues(interaction.data?.components)
    .join(" ")
    .trim()

  return [optionText, modalText].filter(Boolean).join(" ").trim()
}

export const getDiscordInteractionCommand = (
  interaction: DiscordInteraction,
  options?: {
    askCommandName?: string
    newCommandName?: string
  }
): DiscordCommand => {
  const rawName = interaction.data?.name?.trim().toLowerCase() || ""
  const askCommandName = normalizeDiscordCommandName(
    options?.askCommandName,
    "ask"
  )
  const newCommandName = normalizeDiscordCommandName(
    options?.newCommandName,
    "new"
  )
  if (rawName === newCommandName) {
    return "new"
  }
  if (rawName === askCommandName) {
    return "ask"
  }
  if (interaction.type === DISCORD_INTERACTION_MODAL_SUBMIT || !rawName) {
    return "ask"
  }
  return "unsupported"
}

const getDiscordUser = (interaction: DiscordInteraction) =>
  interaction.member?.user || interaction.user

const buildDiscordUserContext = (
  userId: string,
  displayName?: string
): ContextUser => {
  const tenantId = context.getTenantId()
  return {
    _id: `discord:${userId}`,
    tenantId,
    email: `discord+${userId}@example.invalid`,
    roles: {},
    userId,
    firstName: displayName,
  }
}

const splitDiscordMessage = (content: string, maxLength = 2000) => {
  if (content.length <= maxLength) {
    return [content]
  }
  const chunks: string[] = []
  for (let i = 0; i < content.length; i += maxLength) {
    chunks.push(content.slice(i, i + maxLength))
  }
  return chunks
}

const sendDiscordFollowup = async ({
  applicationId,
  token,
  content,
}: {
  applicationId: string
  token: string
  content: string
}) => {
  const url = `${DISCORD_API_BASE_URL}/webhooks/${applicationId}/${token}`
  const chunks = splitDiscordMessage(content)
  for (const chunk of chunks) {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: chunk }),
    })
  }
}

const toDiscordConversationUserId = (userId: string) => `discord:${userId}`

const toSortTimestamp = (chat: ChatConversation): number => {
  const latest = chat.updatedAt || chat.createdAt
  if (!latest) {
    return 0
  }
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
  if (idleTimeoutMs <= 0) {
    return false
  }

  const lastActivity = toSortTimestamp(chat)
  if (!lastActivity) {
    return false
  }

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
  if (chat.chatAppId !== scope.chatAppId) {
    return false
  }
  if (chat.agentId !== scope.agentId) {
    return false
  }
  if (chat.channel?.provider !== "discord") {
    return false
  }
  if (chat.channel?.channelId !== scope.channelId) {
    return false
  }

  const conversationThreadId = chat.channel?.threadId || undefined
  if (conversationThreadId !== scope.threadId) {
    return false
  }

  if (chat.channel?.externalUserId) {
    return chat.channel.externalUserId === scope.externalUserId
  }

  return chat.userId === toDiscordConversationUserId(scope.externalUserId)
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
}) => {
  return chats
    .filter(chat => matchesDiscordConversationScope({ chat, scope }))
    .filter(
      chat => !isDiscordConversationExpired({ chat, idleTimeoutMs, nowMs })
    )
    .sort((a, b) => toSortTimestamp(b) - toSortTimestamp(a))[0]
}

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

  return pickDiscordConversation({
    chats,
    scope,
    idleTimeoutMs,
  })
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
  await context.doInWorkspaceContext(prodAppId, async () => {
    const db = context.getWorkspaceDB()
    const chatApp = await db.tryGet<ChatApp>(chatAppId)
    if (!chatApp) {
      await sendDiscordFollowup({
        applicationId: interaction.application_id,
        token: interaction.token,
        content: "Chat app not found.",
      })
      return
    }

    if (
      !chatApp.agents?.some(
        agent => agent.agentId === agentId && agent.isEnabled
      )
    ) {
      await sendDiscordFollowup({
        applicationId: interaction.application_id,
        token: interaction.token,
        content: "Agent is not enabled for this chat app.",
      })
      return
    }

    const agentConfig = await sdk.ai.agents.getOrThrow(agentId)
    const askCommandName = normalizeDiscordCommandName(
      agentConfig.discordIntegration?.askCommandName,
      "ask"
    )
    const newCommandName = normalizeDiscordCommandName(
      agentConfig.discordIntegration?.newCommandName,
      "new"
    )
    const command = getDiscordInteractionCommand(interaction, {
      askCommandName,
      newCommandName,
    })
    if (command === "unsupported") {
      await sendDiscordFollowup({
        applicationId: interaction.application_id,
        token: interaction.token,
        content: `Use /${askCommandName} with a message to chat, or /${newCommandName} to start a new conversation.`,
      })
      return
    }

    const user = getDiscordUser(interaction)
    const userId = user?.id || "unknown"
    const displayName = user?.global_name || user?.username
    const channelId = interaction.channel_id
    if (!channelId) {
      await sendDiscordFollowup({
        applicationId: interaction.application_id,
        token: interaction.token,
        content: "Missing Discord channel information.",
      })
      return
    }

    const threadId = interaction.thread_id
    const content = extractDiscordContent(interaction)
    if (command === "new" && !content) {
      const chatId = docIds.generateChatConversationID()
      const chatToSave = prepareChatConversationForSave({
        chatId,
        chatAppId,
        userId: toDiscordConversationUserId(userId),
        title: "New conversation",
        messages: [],
        chat: {
          _id: chatId,
          chatAppId,
          agentId,
          title: "New conversation",
          messages: [],
          channel: {
            provider: "discord",
            channelId,
            threadId,
            guildId: interaction.guild_id,
            externalUserId: userId,
            externalUserName: displayName,
          },
        },
      })
      await db.put(chatToSave)
      await sendDiscordFollowup({
        applicationId: interaction.application_id,
        token: interaction.token,
        content: `Started a new conversation. Use /${askCommandName} with a message.`,
      })
      return
    }

    if (!content) {
      await sendDiscordFollowup({
        applicationId: interaction.application_id,
        token: interaction.token,
        content: `Please provide a message after /${askCommandName}.`,
      })
      return
    }

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
      threadId: channel.threadId,
      externalUserId: userId,
    }

    const existingChat =
      command === "new"
        ? undefined
        : await findDiscordConversation({
            scope,
            idleTimeoutMs:
              agentConfig.discordIntegration?.idleTimeoutMinutes &&
              agentConfig.discordIntegration.idleTimeoutMinutes > 0
                ? agentConfig.discordIntegration.idleTimeoutMinutes * 60 * 1000
                : getDiscordIdleTimeoutMs(),
          })

    const userMessage: ChatConversationRequest["messages"][number] = {
      id: v4(),
      role: "user",
      parts: [{ type: "text", text: content }],
    }

    const baseMessages = existingChat?.messages || []
    const draftChat: ChatConversationRequest = {
      _id: existingChat?._id,
      chatAppId,
      agentId,
      title: existingChat?.title || truncateTitle(content),
      messages: [...baseMessages, userMessage],
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
      await sendDiscordFollowup({
        applicationId: interaction.application_id,
        token: interaction.token,
        content: message,
      })
      return
    }

    const chatId = existingChat?._id ?? docIds.generateChatConversationID()
    const chatToSave = prepareChatConversationForSave({
      chatId,
      chatAppId,
      userId: toDiscordConversationUserId(userId),
      title: existingChat?.title || result.title,
      messages: result.messages,
      chat: {
        ...draftChat,
        _id: chatId,
      },
      existingChat,
    })

    await db.put(chatToSave)

    await sendDiscordFollowup({
      applicationId: interaction.application_id,
      token: interaction.token,
      content: result.assistantText || "No response generated.",
    })
  })
}

export async function discordWebhook(
  ctx: Ctx<any, any, { instance: string; chatAppId: string; agentId: string }>
) {
  const signature = ctx.headers[DISCORD_SIGNATURE_HEADER]
  const timestamp = ctx.headers[DISCORD_TIMESTAMP_HEADER]
  const publicKey =
    "c407779844c823b6a19fb31805625412431ae4bafcf7a348345238cb59a68a54"
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
  const isValid = verifyDiscordSignature({
    publicKey,
    signature,
    timestamp,
    rawBody,
  })
  if (!isValid) {
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
