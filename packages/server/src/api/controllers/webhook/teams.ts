import {
  authorizeJWT,
  CloudAdapter,
  getAuthConfigWithDefaults,
  type AuthConfiguration,
  type TurnContext,
} from "@microsoft/agents-hosting"
import { v4 } from "uuid"
import { context, docIds, HTTPError } from "@budibase/backend-core"
import type {
  ChatApp,
  ChatConversation,
  ChatConversationChannel,
  ChatConversationRequest,
  ContextUser,
  Ctx,
  TeamsActivity,
  TeamsCommand,
  TeamsConversationScope,
} from "@budibase/types"
import { DocumentType } from "@budibase/types"
import sdk from "../../../sdk"
import {
  webhookChat,
  prepareChatConversationForSave,
  truncateTitle,
} from "../ai/chatConversations"
import {
  evictExpiredTimedCache,
  ensureProdWorkspaceWebhookRoute,
  isConversationExpired,
  pickLatestConversation,
  type TimedCacheEntry,
  touchTimedCache,
  touchConversationCache,
} from "./utils"

const TEAMS_ASK_COMMAND = "ask"
const TEAMS_NEW_COMMAND = "new"
const TEAMS_DEFAULT_IDLE_TIMEOUT_MS = 45 * 60 * 1000
const TEAMS_DEFAULT_CONVERSATION_CACHE_MAX_ENTRIES = 5000
const TEAMS_DEFAULT_RUNTIME_CACHE_MAX_ENTRIES = 500
const TEAMS_DEFAULT_RUNTIME_CACHE_TTL_MS = 60 * 60 * 1000
const TEAMS_MAX_MESSAGE_LENGTH = 3500
const TEAMS_FALLBACK_ERROR_MESSAGE =
  "Sorry, something went wrong while processing your request."
const TEAMS_WELCOME_MESSAGE = `Budibase agent is ready. Send a message to chat, or "${TEAMS_NEW_COMMAND}" to start a new conversation.`

const teamsConversationCache = new Map<string, string>()
const teamsRuntimeCache = new Map<string, TimedCacheEntry<TeamsRuntime>>()

interface TeamsRuntime {
  adapter: CloudAdapter
  authenticate: ReturnType<typeof authorizeJWT>
}

export const isTeamsConversationExpired = ({
  chat,
  idleTimeoutMs,
  nowMs = Date.now(),
}: {
  chat: ChatConversation
  idleTimeoutMs: number
  nowMs?: number
}) => isConversationExpired({ chat, idleTimeoutMs, nowMs })

const getTeamsConversationCacheKey = ({
  workspaceId,
  scope,
}: {
  workspaceId: string
  scope: TeamsConversationScope
}) =>
  [
    workspaceId,
    scope.chatAppId,
    scope.agentId,
    scope.conversationId,
    scope.channelId || "",
    scope.externalUserId,
  ].join(":")

export const matchesTeamsConversationScope = ({
  chat,
  scope,
}: {
  chat: ChatConversation
  scope: TeamsConversationScope
}) => {
  const ch = chat.channel
  if (
    chat.chatAppId !== scope.chatAppId ||
    chat.agentId !== scope.agentId ||
    ch?.provider !== "msteams" ||
    ch?.conversationId !== scope.conversationId ||
    (ch?.channelId || undefined) !== scope.channelId
  ) {
    return false
  }

  if (ch?.externalUserId) {
    return ch.externalUserId === scope.externalUserId
  }
  return chat.userId === `msteams:${scope.externalUserId}`
}

export const pickTeamsConversation = ({
  chats,
  scope,
  idleTimeoutMs,
  nowMs = Date.now(),
}: {
  chats: ChatConversation[]
  scope: TeamsConversationScope
  idleTimeoutMs: number
  nowMs?: number
}) =>
  pickLatestConversation({
    chats,
    scope,
    idleTimeoutMs,
    matchesConversationScope: matchesTeamsConversationScope,
    nowMs,
  })

const findTeamsConversation = async ({
  db,
  workspaceId,
  scope,
  idleTimeoutMs,
}: {
  db: ReturnType<typeof context.getWorkspaceDB>
  workspaceId: string
  scope: TeamsConversationScope
  idleTimeoutMs: number
}) => {
  const cacheKey = getTeamsConversationCacheKey({ workspaceId, scope })
  const cachedChatId = teamsConversationCache.get(cacheKey)
  if (cachedChatId) {
    const cachedChat = await db.tryGet<ChatConversation>(cachedChatId)
    if (
      cachedChat &&
      matchesTeamsConversationScope({ chat: cachedChat, scope }) &&
      !isTeamsConversationExpired({ chat: cachedChat, idleTimeoutMs })
    ) {
      touchConversationCache({
        cache: teamsConversationCache,
        cacheKey,
        chatId: cachedChatId,
        maxSize: TEAMS_DEFAULT_CONVERSATION_CACHE_MAX_ENTRIES,
      })
      return cachedChat
    }
    teamsConversationCache.delete(cacheKey)
  }

  const response = await db.allDocs<ChatConversation>(
    docIds.getDocParams(DocumentType.CHAT_CONVERSATION, undefined, {
      include_docs: true,
    })
  )

  const chats = response.rows
    .map(row => row.doc)
    .filter((chat): chat is ChatConversation => !!chat)

  const picked = pickTeamsConversation({ chats, scope, idleTimeoutMs })
  if (picked?._id) {
    touchConversationCache({
      cache: teamsConversationCache,
      cacheKey,
      chatId: picked._id,
      maxSize: TEAMS_DEFAULT_CONVERSATION_CACHE_MAX_ENTRIES,
    })
  }
  return picked
}

const getIdleTimeoutMs = (configMinutes?: number) => {
  if (configMinutes && configMinutes > 0) {
    return configMinutes * 60 * 1000
  }
  return TEAMS_DEFAULT_IDLE_TIMEOUT_MS
}

const buildTeamsUserContext = (
  userId: string,
  displayName?: string
): ContextUser => ({
  _id: `msteams:${userId}`,
  tenantId: context.getTenantId(),
  email: `msteams+${userId}@example.invalid`,
  roles: {},
  userId,
  firstName: displayName,
})

const getTeamsErrorMessage = (error: unknown) =>
  error instanceof HTTPError ? error.message : TEAMS_FALLBACK_ERROR_MESSAGE

export const splitTeamsMessage = (
  content: string,
  maxLength = TEAMS_MAX_MESSAGE_LENGTH
): string[] => {
  const normalized = content || "No response generated."
  if (normalized.length <= maxLength) {
    return [normalized]
  }

  const chunks: string[] = []
  for (let i = 0; i < normalized.length; i += maxLength) {
    chunks.push(normalized.slice(i, i + maxLength))
  }
  return chunks
}

export const stripTeamsMentions = (text: string) =>
  text
    .replace(/<at>[^<]*<\/at>/gi, " ")
    .replace(/\s+/g, " ")
    .trim()

export const parseTeamsCommand = (
  text?: string
): {
  command: TeamsCommand
  content: string
} => {
  const normalized = stripTeamsMentions(text || "")
  if (!normalized) {
    return { command: "unsupported" as const, content: "" }
  }

  const match = normalized.match(/^\/?(ask|new)\b(?:\s+(.*))?$/i)
  if (!match) {
    return { command: "ask" as const, content: normalized }
  }

  const commandName = match[1]?.toLowerCase()
  const content = (match[2] || "").trim()
  if (commandName === TEAMS_NEW_COMMAND) {
    return { command: "new" as const, content }
  }
  if (commandName === TEAMS_ASK_COMMAND) {
    return { command: "ask" as const, content }
  }
  return { command: "ask" as const, content: normalized }
}

const buildTeamsAuthConfig = ({
  appId,
  appPassword,
  tenantId,
}: {
  appId: string
  appPassword: string
  tenantId?: string
}) => {
  const authConfig: AuthConfiguration = {
    clientId: appId,
    clientSecret: appPassword,
    tenantId: tenantId || "common",
    authority: "https://login.microsoftonline.com",
    issuers: tenantId
      ? [
          "https://api.botframework.com",
          `https://sts.windows.net/${tenantId}/`,
          `https://login.microsoftonline.com/${tenantId}/v2.0`,
        ]
      : ["https://api.botframework.com"],
  }
  return getAuthConfigWithDefaults(authConfig)
}

const getTeamsRuntime = ({
  agentId,
  appId,
  appPassword,
  tenantId,
}: {
  agentId: string
  appId: string
  appPassword: string
  tenantId?: string
}): TeamsRuntime => {
  const nowMs = Date.now()
  const maxSize = TEAMS_DEFAULT_RUNTIME_CACHE_MAX_ENTRIES
  const ttlMs = TEAMS_DEFAULT_RUNTIME_CACHE_TTL_MS
  const cacheKey = [agentId, appId, appPassword, tenantId || ""].join(":")
  evictExpiredTimedCache({
    cache: teamsRuntimeCache,
    ttlMs,
    nowMs,
  })
  const existing = teamsRuntimeCache.get(cacheKey)
  if (existing) {
    touchTimedCache({
      cache: teamsRuntimeCache,
      cacheKey,
      value: existing.value,
      maxSize,
      nowMs,
    })
    return existing.value
  }

  const authConfig = buildTeamsAuthConfig({ appId, appPassword, tenantId })
  const runtime: TeamsRuntime = {
    adapter: new CloudAdapter(authConfig),
    authenticate: authorizeJWT(authConfig),
  }
  touchTimedCache({
    cache: teamsRuntimeCache,
    cacheKey,
    value: runtime,
    maxSize,
    nowMs,
  })
  return runtime
}

type AuthRequest = Parameters<TeamsRuntime["authenticate"]>[0]
type AuthResponse = Parameters<TeamsRuntime["authenticate"]>[1]
type AuthNext = Parameters<TeamsRuntime["authenticate"]>[2]

interface ResponseProxy {
  status: (code: number) => ResponseProxy
  send: (body?: unknown) => ResponseProxy
  end: () => void
  setHeader: (name: string, value: string | number | readonly string[]) => void
}

const createResponseProxy = (ctx: Ctx<any, any>): ResponseProxy => {
  let statusCode = 200
  const proxy: ResponseProxy = {
    status: (code: number) => {
      statusCode = code
      ctx.status = code
      return proxy
    },
    send: (body?: unknown) => {
      if (body !== undefined) {
        ctx.body = body
      }
      return proxy
    },
    end: () => {
      if (!ctx.status) {
        ctx.status = statusCode
      }
    },
    setHeader: (name, value) => {
      const normalized = Array.isArray(value) ? value.join(",") : String(value)
      ctx.set(name, normalized)
    },
  }
  return proxy
}

const normalizeHeaders = (
  headers: Record<string, string | string[] | undefined>
) => {
  const normalized: Record<string, string | string[] | undefined> = {}
  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === "string" || Array.isArray(value) || !value) {
      normalized[key] = value
    }
  }
  return normalized
}

const runTeamsAuth = async ({
  runtime,
  request,
  response,
}: {
  runtime: TeamsRuntime
  request: AuthRequest
  response: AuthResponse
}) => {
  let passed = false
  const next: AuthNext = () => {
    passed = true
  }
  await runtime.authenticate(request, response, next)
  return passed
}

const handleTeamsMessage = async ({
  turnContext,
  prodAppId,
  chatAppId,
  agentId,
  activity,
}: {
  turnContext: TurnContext
  prodAppId: string
  chatAppId: string
  agentId: string
  activity: TeamsActivity
}) => {
  const reply = async (content: string) => {
    const chunks = splitTeamsMessage(content)
    for (const chunk of chunks) {
      await turnContext.sendActivity(chunk)
    }
  }

  await context.doInWorkspaceContext(prodAppId, async () => {
    const db = context.getWorkspaceDB()
    const chatApp = await db.tryGet<ChatApp>(chatAppId)
    if (!chatApp) {
      return await reply("Chat app not found.")
    }

    if (
      !chatApp.agents?.some(
        configuredAgent =>
          configuredAgent.agentId === agentId && configuredAgent.isEnabled
      )
    ) {
      return await reply("Agent is not enabled for this chat app.")
    }

    const agentConfig = await sdk.ai.agents.getOrThrow(agentId)

    const { command, content } = parseTeamsCommand(activity.text)
    if (command === "unsupported") {
      return await reply(
        `Send a message to chat, or "${TEAMS_NEW_COMMAND}" to start a new conversation.`
      )
    }

    const conversationId = activity.conversation?.id?.trim()
    if (!conversationId) {
      return await reply("Missing Teams conversation information.")
    }

    const externalUserId =
      activity.from?.aadObjectId?.trim() || activity.from?.id?.trim()
    if (!externalUserId) {
      return await reply("Missing Teams user information.")
    }

    const displayName = activity.from?.name?.trim()
    const channelId = activity.channelData?.channel?.id?.trim()
    const teamId = activity.channelData?.team?.id?.trim()
    const tenantId =
      activity.channelData?.tenant?.id?.trim() ||
      activity.from?.tenantId?.trim()
    const conversationType = activity.conversation?.conversationType?.trim()

    const channel: ChatConversationChannel = {
      provider: "msteams",
      conversationId,
      conversationType,
      channelId,
      teamId,
      tenantId,
      externalUserId,
      externalUserName: displayName,
    }

    const scope: TeamsConversationScope = {
      chatAppId,
      agentId,
      conversationId,
      channelId,
      externalUserId,
    }

    if (command === "new" && !content) {
      const chatId = docIds.generateChatConversationID()
      await db.put(
        prepareChatConversationForSave({
          chatId,
          chatAppId,
          userId: `msteams:${externalUserId}`,
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
      touchConversationCache({
        cache: teamsConversationCache,
        cacheKey: getTeamsConversationCacheKey({
          workspaceId: prodAppId,
          scope,
        }),
        chatId,
        maxSize: TEAMS_DEFAULT_CONVERSATION_CACHE_MAX_ENTRIES,
      })
      return await reply(
        "Started a new conversation. Send a message to continue."
      )
    }

    if (!content) {
      return await reply(
        `Please provide a message after "${TEAMS_ASK_COMMAND}", or just send a normal message.`
      )
    }

    const existingChat =
      command === "new"
        ? undefined
        : await findTeamsConversation({
            db,
            workspaceId: prodAppId,
            scope,
            idleTimeoutMs: getIdleTimeoutMs(
              agentConfig.teamsIntegration?.idleTimeoutMinutes
            ),
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

    let result: Awaited<ReturnType<typeof webhookChat>>
    try {
      result = await webhookChat({
        chat: draftChat,
        user: buildTeamsUserContext(externalUserId, displayName),
      })
    } catch (error) {
      return await reply(getTeamsErrorMessage(error))
    }

    const chatId = existingChat?._id ?? docIds.generateChatConversationID()
    await db.put(
      prepareChatConversationForSave({
        chatId,
        chatAppId,
        userId: `msteams:${externalUserId}`,
        title: existingChat?.title || result.title,
        messages: result.messages,
        chat: { ...draftChat, _id: chatId },
        existingChat,
      })
    )

    touchConversationCache({
      cache: teamsConversationCache,
      cacheKey: getTeamsConversationCacheKey({
        workspaceId: prodAppId,
        scope,
      }),
      chatId,
      maxSize: TEAMS_DEFAULT_CONVERSATION_CACHE_MAX_ENTRIES,
    })

    await reply(result.assistantText || "No response generated.")
  })
}

const handleTeamsLifecycleActivity = async ({
  turnContext,
  activity,
}: {
  turnContext: TurnContext
  activity: TeamsActivity
}) => {
  if (!isTeamsLifecycleActivity(activity)) {
    return
  }
  await turnContext.sendActivity(TEAMS_WELCOME_MESSAGE)
}

export const isTeamsLifecycleActivity = (activity: TeamsActivity) =>
  activity.type === "conversationUpdate" ||
  activity.type === "installationUpdate"

const handleTeamsTurn = async ({
  turnContext,
  prodAppId,
  chatAppId,
  agentId,
}: {
  turnContext: TurnContext
  prodAppId: string
  chatAppId: string
  agentId: string
}) => {
  const activity = turnContext.activity as TeamsActivity
  if (activity.type === "message") {
    await handleTeamsMessage({
      turnContext,
      prodAppId,
      chatAppId,
      agentId,
      activity,
    })
    return
  }

  await handleTeamsLifecycleActivity({
    turnContext,
    activity,
  })
}

export async function teamsWebhook(
  ctx: Ctx<any, any, { instance: string; chatAppId: string; agentId: string }>
) {
  const { instance, chatAppId, agentId } = ctx.params
  const prodAppId = ensureProdWorkspaceWebhookRoute({
    ctx,
    instance,
    providerName: "Teams",
  })
  if (!prodAppId) {
    return
  }

  let integration: ReturnType<
    typeof sdk.ai.deployments.teams.validateTeamsIntegration
  >
  try {
    integration = await context.doInWorkspaceContext(prodAppId, async () => {
      const agent = await sdk.ai.agents.getOrThrow(agentId)
      return sdk.ai.deployments.teams.validateTeamsIntegration(agent)
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      ctx.status = error.status
      ctx.body = { error: error.message }
      return
    }
    throw error
  }

  const runtime = getTeamsRuntime({
    agentId,
    appId: integration.appId,
    appPassword: integration.appPassword,
    tenantId: integration.tenantId,
  })

  const request: AuthRequest = {
    body: (ctx.request.body || {}) as Record<string, unknown>,
    headers: normalizeHeaders(ctx.headers),
    method: ctx.method,
  }

  const responseProxy = createResponseProxy(ctx)
  const authenticated = await runTeamsAuth({
    runtime,
    request,
    response: responseProxy as unknown as AuthResponse,
  })
  if (!authenticated) {
    return
  }

  try {
    await runtime.adapter.process(
      request,
      responseProxy as unknown as Parameters<CloudAdapter["process"]>[1],
      async turnContext => {
        try {
          await handleTeamsTurn({
            turnContext,
            prodAppId,
            chatAppId,
            agentId,
          })
        } catch (error) {
          console.error("Teams webhook processing failed", error)
          await turnContext.sendActivity(getTeamsErrorMessage(error))
        }
      }
    )
  } catch (error) {
    const message = getTeamsErrorMessage(error)
    ctx.status = 500
    ctx.body = { error: message }
  }
}
