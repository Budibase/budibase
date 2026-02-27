import { v4 } from "uuid"
import { context, docIds, HTTPError, redis } from "@budibase/backend-core"
import type { RedisClient } from "@budibase/backend-core"
import type {
  ChatApp,
  ChatConversation,
  ChatConversationChannel,
  ChatConversationRequest,
  ContextUser,
} from "@budibase/types"
import { DocumentType } from "@budibase/types"
import {
  webhookChat,
  prepareChatConversationForSave,
  truncateTitle,
} from "../ai/chatConversations"
import {
  isConversationExpired,
  pickLatestConversation,
  touchConversationCache,
} from "./utils"

const DEFAULT_IDLE_TIMEOUT_MS = 45 * 60 * 1000
const DEFAULT_CONVERSATION_CACHE_SIZE = 5000
const CONVERSATION_SCOPE_CACHE_KEY_PREFIX = "chatConversationScope"
const REDIS_CACHE_INIT_RETRY_MS = 30 * 1000

const conversationCache = new Map<string, string>()
let conversationCacheClient: RedisClient | undefined
let conversationCacheClientInitInFlight:
  | Promise<RedisClient | undefined>
  | undefined
let conversationCacheClientLastFailureAt = 0

interface ConversationScope {
  chatAppId: string
  agentId: string
  externalUserId: string
  channelId?: string
  threadId?: string
  conversationId?: string
}

const getCacheKey = ({
  workspaceId,
  scope,
}: {
  workspaceId: string
  scope: ConversationScope
}) =>
  [
    workspaceId,
    scope.chatAppId,
    scope.agentId,
    scope.channelId || "",
    scope.threadId || "",
    scope.conversationId || "",
    scope.externalUserId,
  ].join(":")

const getRedisScopeCacheKey = (cacheKey: string) =>
  `${CONVERSATION_SCOPE_CACHE_KEY_PREFIX}:${cacheKey}`

const getConversationCacheClient = async (): Promise<
  RedisClient | undefined
> => {
  if (conversationCacheClient) {
    return conversationCacheClient
  }

  const redisUrl = process.env.REDIS_URL?.trim()
  if (!redisUrl) {
    return undefined
  }

  if (conversationCacheClientInitInFlight) {
    return await conversationCacheClientInitInFlight
  }

  if (
    conversationCacheClientLastFailureAt > 0 &&
    Date.now() - conversationCacheClientLastFailureAt <
      REDIS_CACHE_INIT_RETRY_MS
  ) {
    return undefined
  }

  conversationCacheClientInitInFlight = (async () => {
    try {
      conversationCacheClient = await redis.clients.getCacheClient()
      conversationCacheClientLastFailureAt = 0
      return conversationCacheClient
    } catch (error) {
      console.error(
        "Failed to initialize chat conversation cache client",
        error
      )
      conversationCacheClient = undefined
      conversationCacheClientLastFailureAt = Date.now()
      return undefined
    } finally {
      conversationCacheClientInitInFlight = undefined
    }
  })()

  return await conversationCacheClientInitInFlight
}

const cacheConversationIdInMemory = ({
  cacheKey,
  chatId,
}: {
  cacheKey: string
  chatId: string
}) => {
  touchConversationCache({
    cache: conversationCache,
    cacheKey,
    chatId,
    maxSize: DEFAULT_CONVERSATION_CACHE_SIZE,
  })
}

const cacheConversationId = async ({
  cacheKey,
  chatId,
  idleTimeoutMs,
}: {
  cacheKey: string
  chatId: string
  idleTimeoutMs: number
}) => {
  if (!chatId) {
    return
  }

  cacheConversationIdInMemory({
    cacheKey,
    chatId,
  })

  const client = await getConversationCacheClient()
  if (!client || idleTimeoutMs <= 0) {
    return
  }

  const ttlSeconds = Math.max(1, Math.floor(idleTimeoutMs / 1000))
  try {
    await client.store(getRedisScopeCacheKey(cacheKey), chatId, ttlSeconds)
  } catch (error) {
    console.error("Failed to write chat conversation cache entry", error)
  }
}

const clearCachedConversationId = async (cacheKey: string) => {
  conversationCache.delete(cacheKey)

  const client = await getConversationCacheClient()
  if (!client) {
    return
  }
  try {
    await client.delete(getRedisScopeCacheKey(cacheKey))
  } catch (error) {
    console.error("Failed to clear chat conversation cache entry", error)
  }
}

const findCachedConversationById = async ({
  db,
  chatId,
  scope,
  provider,
  idleTimeoutMs,
  cacheKey,
}: {
  db: ReturnType<typeof context.getWorkspaceDB>
  chatId: string
  scope: ConversationScope
  provider: string
  idleTimeoutMs: number
  cacheKey: string
}) => {
  const cachedChat = await db.tryGet<ChatConversation>(chatId)
  if (
    cachedChat &&
    matchesScope({ chat: cachedChat, scope, provider }) &&
    !isConversationExpired({ chat: cachedChat, idleTimeoutMs })
  ) {
    cacheConversationIdInMemory({
      cacheKey,
      chatId,
    })
    return cachedChat
  }

  await clearCachedConversationId(cacheKey)
  return undefined
}

const matchesScope = ({
  chat,
  scope,
  provider,
}: {
  chat: ChatConversation
  scope: ConversationScope
  provider: string
}) => {
  const ch = chat.channel
  if (
    chat.chatAppId !== scope.chatAppId ||
    chat.agentId !== scope.agentId ||
    ch?.provider !== provider
  ) {
    return false
  }

  if (provider === "discord") {
    if (
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

  if (provider === "msteams") {
    return (
      ch?.conversationId === scope.conversationId &&
      (ch?.channelId || undefined) === scope.channelId &&
      ch?.externalUserId === scope.externalUserId
    )
  }

  return false
}

const findConversation = async ({
  db,
  workspaceId,
  scope,
  provider,
  idleTimeoutMs,
}: {
  db: ReturnType<typeof context.getWorkspaceDB>
  workspaceId: string
  scope: ConversationScope
  provider: string
  idleTimeoutMs: number
}) => {
  const cacheKey = getCacheKey({ workspaceId, scope })
  const cachedChatId = conversationCache.get(cacheKey)
  if (cachedChatId) {
    const cachedConversation = await findCachedConversationById({
      db,
      chatId: cachedChatId,
      scope,
      provider,
      idleTimeoutMs,
      cacheKey,
    })
    if (cachedConversation) {
      return cachedConversation
    }
  }

  const client = await getConversationCacheClient()
  if (client) {
    let redisChatId: unknown
    try {
      redisChatId = await client.get(getRedisScopeCacheKey(cacheKey))
    } catch (error) {
      console.error("Failed to read chat conversation cache entry", error)
      redisChatId = undefined
    }
    if (typeof redisChatId === "string" && redisChatId.trim()) {
      const cachedConversation = await findCachedConversationById({
        db,
        chatId: redisChatId,
        scope,
        provider,
        idleTimeoutMs,
        cacheKey,
      })
      if (cachedConversation) {
        return cachedConversation
      }
    }
  }

  const response = await db.allDocs<ChatConversation>(
    docIds.getDocParams(DocumentType.CHAT_CONVERSATION, undefined, {
      include_docs: true,
    })
  )
  const chats = response.rows
    .map(row => row.doc)
    .filter((chat): chat is ChatConversation => !!chat)

  const picked = pickLatestConversation({
    chats,
    scope,
    idleTimeoutMs,
    matchesConversationScope: ({ chat, scope: s }) =>
      matchesScope({ chat, scope: s, provider }),
  })

  if (picked?._id) {
    await cacheConversationId({
      cacheKey,
      chatId: picked._id,
      idleTimeoutMs,
    })
  }
  return picked
}

const getIdleTimeoutMs = (configMinutes?: number) => {
  if (configMinutes && configMinutes > 0) {
    return configMinutes * 60 * 1000
  }
  return DEFAULT_IDLE_TIMEOUT_MS
}

export interface HandleChatMessageParams {
  reply: (text: string) => Promise<void>
  workspaceId: string
  chatAppId: string
  agentId: string
  provider: "discord" | "msteams"
  command: "ask" | "new"
  content: string
  user: {
    externalUserId: string
    displayName?: string
  }
  channel: ChatConversationChannel
  scope: ConversationScope
  idleTimeoutMinutes?: number
}

export const handleChatMessage = async ({
  reply,
  workspaceId,
  chatAppId,
  agentId,
  provider,
  command,
  content,
  user,
  channel,
  scope,
  idleTimeoutMinutes,
}: HandleChatMessageParams): Promise<void> => {
  const userPrefix = provider === "discord" ? "discord" : "msteams"
  const userId = `${userPrefix}:${user.externalUserId}`

  await context.doInWorkspaceContext(workspaceId, async () => {
    const idleTimeoutMs = getIdleTimeoutMs(idleTimeoutMinutes)
    const db = context.getWorkspaceDB()
    const chatApp = await db.tryGet<ChatApp>(chatAppId)
    if (!chatApp) {
      await reply("Chat app not found.")
      return
    }

    if (
      !chatApp.agents?.some(
        agent => agent.agentId === agentId && agent.isEnabled
      )
    ) {
      await reply("Agent is not enabled for this chat app.")
      return
    }

    if (command === "new" && !content) {
      const chatId = docIds.generateChatConversationID()
      await db.put(
        prepareChatConversationForSave({
          chatId,
          chatAppId,
          userId,
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
      await cacheConversationId({
        cacheKey: getCacheKey({ workspaceId, scope }),
        chatId,
        idleTimeoutMs,
      })
      const msg =
        provider === "discord"
          ? "Started a new conversation. Use /ask with a message."
          : "Started a new conversation. Send a message to continue."
      await reply(msg)
      return
    }

    if (!content) {
      const msg =
        provider === "discord"
          ? "Please provide a message after /ask."
          : 'Please provide a message after "ask", or just send a normal message.'
      await reply(msg)
      return
    }

    const existingChat =
      command === "new"
        ? undefined
        : await findConversation({
            db,
            workspaceId,
            scope,
            provider,
            idleTimeoutMs,
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

    const contextUser: ContextUser = {
      _id: userId,
      tenantId: context.getTenantId(),
      email: `${userPrefix}+${user.externalUserId}@example.invalid`,
      roles: {},
      userId: user.externalUserId,
      firstName: user.displayName,
    }
    console.log("test?")
    let result: Awaited<ReturnType<typeof webhookChat>>
    try {
      result = await webhookChat({ chat: draftChat, user: contextUser })
    } catch (error) {
      const message =
        error instanceof HTTPError
          ? error.message
          : "Sorry, something went wrong while processing your request."
      await reply(message)
      return
    }

    const chatId = existingChat?._id ?? docIds.generateChatConversationID()
    await db.put(
      prepareChatConversationForSave({
        chatId,
        chatAppId,
        userId,
        title: existingChat?.title || result.title,
        messages: result.messages,
        chat: { ...draftChat, _id: chatId },
        existingChat,
      })
    )
    await cacheConversationId({
      cacheKey: getCacheKey({ workspaceId, scope }),
      chatId,
      idleTimeoutMs,
    })

    await reply(result.assistantText || "No response generated.")
  })
}
