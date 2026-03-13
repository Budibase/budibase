import {
  configs,
  context,
  HTTPError,
  redis,
  utils,
  type RedisClient,
} from "@budibase/backend-core"
import type {
  ChatIdentityLink,
  ChatIdentityLinkProvider,
} from "@budibase/types"
import { DocumentType } from "@budibase/types"

const CHAT_LINK_SESSION_CACHE_KEY_PREFIX = "chatIdentityLinkSession"
const CHAT_LINK_SESSION_TTL_SECONDS = 10 * 60
const REDIS_CACHE_INIT_RETRY_MS = 30 * 1000

const inMemoryLinkSessions = new Map<string, ChatIdentityLinkSession>()
let cacheClient: RedisClient | undefined
let cacheClientInitInFlight: Promise<RedisClient | undefined> | undefined
let cacheClientLastFailureAt = 0

const chatIdentityProviders: ChatIdentityLinkProvider[] = [
  "discord",
  "msteams",
  "slack",
]

export interface ChatIdentityLinkSession {
  token: string
  tenantId: string
  workspaceId: string
  provider: ChatIdentityLinkProvider
  externalUserId: string
  externalUserName?: string
  teamId?: string
  guildId?: string
  providerTenantId?: string
  createdAt: string
  expiresAt: string
}

interface ChatIdentityProviderRedirectInput {
  provider: ChatIdentityLinkProvider
  teamId?: string
}

interface UpsertChatIdentityLinkInput {
  provider: ChatIdentityLinkProvider
  externalUserId: string
  externalUserName?: string
  teamId?: string
  guildId?: string
  providerTenantId?: string
  globalUserId: string
  linkedBy?: string
}

interface CreateChatIdentityLinkSessionInput {
  workspaceId: string
  provider: ChatIdentityLinkProvider
  externalUserId: string
  externalUserName?: string
  teamId?: string
  guildId?: string
  providerTenantId?: string
}

interface ChatIdentityLinkLookupInput {
  provider: ChatIdentityLinkProvider
  externalUserId: string
  teamId?: string
  providerTenantId?: string
}

const normalizeRequiredString = (value: string, field: string) => {
  const normalized = value?.trim()
  if (!normalized) {
    throw new HTTPError(`${field} is required`, 400)
  }
  return normalized
}

const normalizeOptionalString = (value?: string) => {
  const normalized = value?.trim()
  return normalized?.length ? normalized : undefined
}

const normalizeProvider = (
  provider: ChatIdentityLinkProvider
): ChatIdentityLinkProvider => {
  const normalized = normalizeRequiredString(provider, "provider")
  if (!chatIdentityProviders.includes(normalized as ChatIdentityLinkProvider)) {
    throw new HTTPError("provider must be discord, msteams, or slack", 400)
  }
  return normalized as ChatIdentityLinkProvider
}

const getProviderScopeKey = ({
  provider,
  teamId,
  providerTenantId,
}: {
  provider: ChatIdentityLinkProvider
  teamId?: string
  providerTenantId?: string
}) => {
  if (provider === "slack") {
    return normalizeOptionalString(teamId)
  }

  if (provider === "msteams") {
    return (
      normalizeOptionalString(providerTenantId) ||
      normalizeOptionalString(teamId)
    )
  }

  return undefined
}

const getLinkDocId = ({
  tenantId,
  provider,
  externalUserId,
  teamId,
  providerTenantId,
}: {
  tenantId: string
  provider: ChatIdentityLinkProvider
  externalUserId: string
  teamId?: string
  providerTenantId?: string
}) => {
  const providerScopeKey = getProviderScopeKey({
    provider,
    teamId,
    providerTenantId,
  })

  return `${DocumentType.CHAT_IDENTITY_LINK}_${encodeURIComponent(
    tenantId
  )}_${provider}${
    providerScopeKey ? `_${encodeURIComponent(providerScopeKey)}` : ""
  }_${encodeURIComponent(externalUserId)}`
}

const getSessionCacheKey = (token: string) =>
  `${CHAT_LINK_SESSION_CACHE_KEY_PREFIX}:${token}`

const getChatLinkSessionCacheClient = async (): Promise<
  RedisClient | undefined
> => {
  if (cacheClient) {
    return cacheClient
  }

  const redisUrl = process.env.REDIS_URL
  if (!redisUrl) {
    return undefined
  }

  if (cacheClientInitInFlight) {
    return await cacheClientInitInFlight
  }

  if (
    cacheClientLastFailureAt > 0 &&
    Date.now() - cacheClientLastFailureAt < REDIS_CACHE_INIT_RETRY_MS
  ) {
    return undefined
  }

  cacheClientInitInFlight = (async () => {
    try {
      cacheClient = await redis.clients.getCacheClient()
      cacheClientLastFailureAt = 0
      return cacheClient
    } catch (error) {
      console.error(
        "Failed to initialize chat identity link cache client",
        error
      )
      cacheClient = undefined
      cacheClientLastFailureAt = Date.now()
      return undefined
    } finally {
      cacheClientInitInFlight = undefined
    }
  })()

  return await cacheClientInitInFlight
}

const parseSessionFromUnknown = (
  value: unknown
): ChatIdentityLinkSession | undefined => {
  const record =
    typeof value === "string"
      ? (() => {
          try {
            return JSON.parse(value) as unknown
          } catch {
            return undefined
          }
        })()
      : value

  if (!record || typeof record !== "object") {
    return undefined
  }

  const raw = record as Record<string, unknown>
  const token = typeof raw.token === "string" ? raw.token : undefined
  const tenantId = typeof raw.tenantId === "string" ? raw.tenantId : undefined
  const workspaceId =
    typeof raw.workspaceId === "string" ? raw.workspaceId : undefined
  const provider = typeof raw.provider === "string" ? raw.provider : undefined
  const externalUserId =
    typeof raw.externalUserId === "string" ? raw.externalUserId : undefined
  const createdAt =
    typeof raw.createdAt === "string" ? raw.createdAt : undefined
  const expiresAt =
    typeof raw.expiresAt === "string" ? raw.expiresAt : undefined

  if (
    !token ||
    !tenantId ||
    !workspaceId ||
    !provider ||
    !externalUserId ||
    !createdAt ||
    !expiresAt
  ) {
    return undefined
  }

  if (!chatIdentityProviders.includes(provider as ChatIdentityLinkProvider)) {
    return undefined
  }

  return {
    token,
    tenantId,
    workspaceId,
    provider: provider as ChatIdentityLinkProvider,
    externalUserId,
    externalUserName:
      typeof raw.externalUserName === "string"
        ? raw.externalUserName
        : undefined,
    teamId: typeof raw.teamId === "string" ? raw.teamId : undefined,
    guildId: typeof raw.guildId === "string" ? raw.guildId : undefined,
    providerTenantId:
      typeof raw.providerTenantId === "string"
        ? raw.providerTenantId
        : undefined,
    createdAt,
    expiresAt,
  }
}

const isExpired = (expiresAt: string) =>
  Date.now() >= new Date(expiresAt).getTime()

const storeSession = async (session: ChatIdentityLinkSession) => {
  inMemoryLinkSessions.set(session.token, session)

  const client = await getChatLinkSessionCacheClient()
  if (!client) {
    return
  }

  try {
    await client.store(
      getSessionCacheKey(session.token),
      session,
      CHAT_LINK_SESSION_TTL_SECONDS
    )
  } catch (error) {
    console.error("Failed to store chat identity link session", error)
  }
}

const clearSession = async (token: string) => {
  inMemoryLinkSessions.delete(token)

  const client = await getChatLinkSessionCacheClient()
  if (!client) {
    return
  }

  try {
    await client.delete(getSessionCacheKey(token))
  } catch (error) {
    console.error("Failed to clear chat identity link session", error)
  }
}

const loadSession = async (token: string) => {
  const normalizedToken = normalizeRequiredString(token, "token")
  const inMemory = inMemoryLinkSessions.get(normalizedToken)
  if (inMemory) {
    if (isExpired(inMemory.expiresAt)) {
      await clearSession(normalizedToken)
      return undefined
    }
    return inMemory
  }

  const client = await getChatLinkSessionCacheClient()
  if (!client) {
    return undefined
  }

  try {
    const value = await client.get(getSessionCacheKey(normalizedToken))
    const session = parseSessionFromUnknown(value)
    if (!session) {
      return undefined
    }
    if (isExpired(session.expiresAt)) {
      await clearSession(normalizedToken)
      return undefined
    }
    inMemoryLinkSessions.set(normalizedToken, session)
    return session
  } catch (error) {
    console.error("Failed to load chat identity link session", error)
    return undefined
  }
}

export const buildChatIdentityProviderRedirectUrl = ({
  provider,
  teamId,
}: ChatIdentityProviderRedirectInput) => {
  if (provider === "slack") {
    if (teamId) {
      return `https://app.slack.com/client/${encodeURIComponent(teamId)}`
    }
    return "https://slack.com/app_redirect"
  }
  if (provider === "msteams") {
    return "https://teams.microsoft.com"
  }
  return "https://discord.com/channels/@me"
}

export const createChatIdentityLinkSession = async ({
  workspaceId,
  provider,
  externalUserId,
  externalUserName,
  teamId,
  guildId,
  providerTenantId,
}: CreateChatIdentityLinkSessionInput) => {
  const normalizedWorkspaceId = normalizeRequiredString(
    workspaceId,
    "workspaceId"
  )
  const normalizedProvider = normalizeProvider(provider)
  const normalizedExternalUserId = normalizeRequiredString(
    externalUserId,
    "externalUserId"
  )
  const now = new Date()
  const expiresAt = new Date(
    now.getTime() + CHAT_LINK_SESSION_TTL_SECONDS * 1000
  ).toISOString()

  const session: ChatIdentityLinkSession = {
    token: utils.newid(),
    tenantId: context.getTenantId(),
    workspaceId: normalizedWorkspaceId,
    provider: normalizedProvider,
    externalUserId: normalizedExternalUserId,
    externalUserName: normalizeOptionalString(externalUserName),
    teamId: normalizeOptionalString(teamId),
    guildId: normalizeOptionalString(guildId),
    providerTenantId: normalizeOptionalString(providerTenantId),
    createdAt: now.toISOString(),
    expiresAt,
  }

  await storeSession(session)
  return session
}

export const getChatIdentityLinkSession = async (token: string) => {
  const session = await loadSession(token)
  if (!session) {
    return undefined
  }
  if (session.tenantId !== context.getTenantId()) {
    return undefined
  }
  return session
}

export const consumeChatIdentityLinkSession = async (token: string) => {
  const session = await getChatIdentityLinkSession(token)
  if (!session) {
    return undefined
  }
  await clearSession(token)
  return session
}

export const getChatIdentityLink = async ({
  provider,
  externalUserId,
  teamId,
  providerTenantId,
}: ChatIdentityLinkLookupInput) => {
  const tenantId = context.getTenantId()
  const normalizedProvider = normalizeProvider(provider)
  const normalizedExternalUserId = normalizeRequiredString(
    externalUserId,
    "externalUserId"
  )
  const db = context.getWorkspaceDB()
  return await db.tryGet<ChatIdentityLink>(
    getLinkDocId({
      tenantId,
      provider: normalizedProvider,
      externalUserId: normalizedExternalUserId,
      teamId,
      providerTenantId,
    })
  )
}

export const upsertChatIdentityLink = async ({
  provider,
  externalUserId,
  externalUserName,
  teamId,
  guildId,
  providerTenantId,
  globalUserId,
  linkedBy,
}: UpsertChatIdentityLinkInput): Promise<ChatIdentityLink> => {
  const tenantId = context.getTenantId()
  const normalizedProvider = normalizeProvider(provider)
  const normalizedExternalUserId = normalizeRequiredString(
    externalUserId,
    "externalUserId"
  )
  const normalizedGlobalUserId = normalizeRequiredString(
    globalUserId,
    "globalUserId"
  )
  const normalizedLinkedBy =
    normalizeOptionalString(linkedBy) || normalizedGlobalUserId

  const db = context.getWorkspaceDB()
  const linkId = getLinkDocId({
    tenantId,
    provider: normalizedProvider,
    externalUserId: normalizedExternalUserId,
    teamId,
    providerTenantId,
  })
  const existing = await db.tryGet<ChatIdentityLink>(linkId)

  const now = new Date().toISOString()
  const next: ChatIdentityLink = {
    _id: linkId,
    ...(existing?._rev ? { _rev: existing._rev } : {}),
    tenantId,
    provider: normalizedProvider,
    externalUserId: normalizedExternalUserId,
    globalUserId: normalizedGlobalUserId,
    linkedAt: now,
    linkedBy: normalizedLinkedBy,
    externalUserName:
      normalizeOptionalString(externalUserName) || existing?.externalUserName,
    teamId: normalizeOptionalString(teamId) || existing?.teamId,
    guildId: normalizeOptionalString(guildId) || existing?.guildId,
    providerTenantId:
      normalizeOptionalString(providerTenantId) || existing?.providerTenantId,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  }

  const response = await db.put(next)
  return {
    ...next,
    _rev: response.rev,
  }
}
