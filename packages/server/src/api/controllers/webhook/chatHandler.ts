import { v4 } from "uuid"
import {
  configs,
  context,
  docIds,
  HTTPError,
  logging,
  redis,
} from "@budibase/backend-core"
import { ChatCommands, type SupportedChatCommand } from "@budibase/shared-core"
import type { RedisClient } from "@budibase/backend-core"
import type {
  ChatApp,
  ChatConversation,
  ChatConversationChannel,
  ChatConversationRequest,
  ContextUser,
} from "@budibase/types"
import { AgentChannelProvider, DocumentType } from "@budibase/types"
import sdk from "../../../sdk"
import { getGlobalUser } from "../../../utilities/global"
import { canAccessChatAppAgentForUser } from "../ai/chatApps"
import { webhookChat } from "../ai/chatConversations"
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

interface LinkPromptMessage {
  text: string
  linkUrl: string
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
  provider: AgentChannelProvider
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
  provider: AgentChannelProvider
}) => {
  const ch = chat.channel
  if (
    chat.chatAppId !== scope.chatAppId ||
    chat.agentId !== scope.agentId ||
    ch?.provider !== provider
  ) {
    return false
  }

  if (provider === AgentChannelProvider.DISCORD) {
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

  if (provider === AgentChannelProvider.MSTEAMS) {
    return (
      ch?.conversationId === scope.conversationId &&
      ch?.threadId === scope.threadId &&
      (ch?.channelId || undefined) === scope.channelId &&
      ch?.externalUserId === scope.externalUserId
    )
  }

  if (provider === AgentChannelProvider.SLACK) {
    return (
      ch?.channelId === scope.channelId &&
      (ch?.threadId || undefined) === scope.threadId &&
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
  provider: AgentChannelProvider
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
  replyLinkPrompt: (message: LinkPromptMessage) => Promise<void>
  workspaceId: string
  chatAppId: string
  agentId: string
  provider: AgentChannelProvider
  channelEnabled: boolean
  command: SupportedChatCommand
  content: string
  user: {
    externalUserId: string
    displayName?: string
  }
  channel: ChatConversationChannel
  scope: ConversationScope
  idleTimeoutMinutes?: number
}

const providerDisplayName = (provider: HandleChatMessageParams["provider"]) => {
  if (provider === AgentChannelProvider.DISCORD) {
    return "Discord"
  }
  if (provider === AgentChannelProvider.MSTEAMS) {
    return "Teams"
  }
  return "Slack"
}

const getLinkCommand = (provider: HandleChatMessageParams["provider"]) =>
  provider === AgentChannelProvider.MSTEAMS
    ? `${ChatCommands.LINK} or /${ChatCommands.LINK}`
    : `/${ChatCommands.LINK}`

export const handleChatMessage = async ({
  reply,
  replyLinkPrompt,
  workspaceId,
  chatAppId,
  agentId,
  provider,
  channelEnabled,
  command,
  content,
  user,
  channel,
  scope,
  idleTimeoutMinutes,
}: HandleChatMessageParams): Promise<void> => {
  await context.doInWorkspaceContext(workspaceId, async () => {
    const idleTimeoutMs = getIdleTimeoutMs(idleTimeoutMinutes)
    const db = context.getWorkspaceDB()
    const chatApp = await db.tryGet<ChatApp>(chatAppId)
    if (!chatApp) {
      await reply("Chat app not found.")
      return
    }

    if (!channelEnabled) {
      await reply("Agent is not enabled for this chat app.")
      return
    }

    const chatAgentConfig = chatApp.agents?.find(
      agent => agent.agentId === agentId
    )
    if (!chatAgentConfig) {
      await reply("Agent is not enabled for this chat app.")
      return
    }

    const existingLink = await sdk.ai.chatIdentityLinks.getChatIdentityLink({
      provider,
      externalUserId: user.externalUserId,
      teamId: channel.teamId,
      providerTenantId: channel.tenantId,
    })

    const createLinkPromptMessage = async ({
      linkedAlready,
      prefix,
    }: {
      linkedAlready: boolean
      prefix: string
    }): Promise<LinkPromptMessage> => {
      const session =
        await sdk.ai.chatIdentityLinks.createChatIdentityLinkSession({
          workspaceId,
          provider,
          externalUserId: user.externalUserId,
          externalUserName: user.displayName,
          teamId: channel.teamId,
          guildId: channel.guildId,
          providerTenantId: channel.tenantId,
        })

      const platformUrl = await configs.getPlatformUrl({ tenantAware: true })
      const linkUrl = `${platformUrl.replace(/\/$/, "")}/api/chat-links/${workspaceId}/${session.token}/handoff`

      const suffix = linkedAlready
        ? "Completing this link will replace the previous Budibase user mapping."
        : `Run ${getLinkCommand(provider)} any time to generate a fresh link.`

      return {
        text: `${prefix} ${suffix}`,
        linkUrl,
      }
    }

    if (command === ChatCommands.LINK) {
      const prompt = await createLinkPromptMessage({
        linkedAlready: !!existingLink,
        prefix: existingLink
          ? `Your ${providerDisplayName(provider)} account is already linked.`
          : `Link your ${providerDisplayName(provider)} account to continue chatting with this agent.`,
      })
      await replyLinkPrompt(prompt)
      return
    }

    if (!existingLink) {
      if (provider === AgentChannelProvider.MSTEAMS) {
        const providerScopeKey = channel.tenantId || channel.teamId
        const linkIdTried = `${DocumentType.CHAT_IDENTITY_LINK}_${encodeURIComponent(
          context.getTenantId()
        )}_${provider}${
          providerScopeKey ? `_${encodeURIComponent(providerScopeKey)}` : ""
        }_${encodeURIComponent(user.externalUserId)}`

        logging.logWarn("chat_link_lookup_miss", {
          workspaceId,
          chatAppId,
          agentId,
          provider,
          externalUserIdTried: user.externalUserId,
          linkIdTried,
          providerTenantId: channel.tenantId,
          teamId: channel.teamId,
        })
      }

      const prompt = await createLinkPromptMessage({
        linkedAlready: false,
        prefix: `Your ${providerDisplayName(provider)} account is not linked yet.`,
      })
      await replyLinkPrompt(prompt)
      return
    }

    let linkedUser: ContextUser
    try {
      linkedUser = await getGlobalUser(existingLink.globalUserId)
    } catch (error) {
      console.error("Failed to resolve linked chat identity user", error)
      await reply(
        `Your ${providerDisplayName(provider)} account link is stale. Run ${getLinkCommand(
          provider
        )} to reconnect it.`
      )
      return
    }

    const linkedUserId = linkedUser._id
    if (!linkedUserId) {
      await reply(
        `Your ${providerDisplayName(provider)} account link is invalid. Run ${getLinkCommand(
          provider
        )} to reconnect it.`
      )
      return
    }

    const hasAccess = await canAccessChatAppAgentForUser(
      {
        user: linkedUser,
        roleId: linkedUser.roleId ?? undefined,
      },
      chatAgentConfig
    )
    if (!hasAccess) {
      await reply(
        "Your linked Budibase account does not have access to this agent."
      )
      return
    }

    const userId = linkedUserId

    if (command === ChatCommands.NEW && !content) {
      const chatId = docIds.generateChatConversationID()
      await db.put(
        sdk.ai.chatConversations.prepareChatConversationForSave({
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
        provider === AgentChannelProvider.DISCORD
          ? `Started a new conversation. Use /${ChatCommands.ASK} with a message.`
          : "Started a new conversation. Send a message to continue."
      await reply(msg)
      return
    }

    if (!content) {
      const msg =
        provider === AgentChannelProvider.DISCORD
          ? `Please provide a message after /${ChatCommands.ASK}.`
          : `Please provide a message after "${ChatCommands.ASK}", or just send a normal message.`
      await reply(msg)
      return
    }

    const existingChat =
      command === ChatCommands.NEW
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

    const chatId = existingChat?._id ?? docIds.generateChatConversationID()
    const draftChat: ChatConversationRequest = {
      _id: chatId,
      chatAppId,
      agentId,
      title:
        existingChat?.title || sdk.ai.chatConversations.truncateTitle(content),
      messages: [...(existingChat?.messages || []), userMessage],
      channel,
    }

    let result: Awaited<ReturnType<typeof webhookChat>>
    try {
      result = await webhookChat({ chat: draftChat, user: linkedUser })
    } catch (error) {
      const message =
        error instanceof HTTPError
          ? error.message
          : "Sorry, something went wrong while processing your request."
      await reply(message)
      return
    }

    await db.put(
      sdk.ai.chatConversations.prepareChatConversationForSave({
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
