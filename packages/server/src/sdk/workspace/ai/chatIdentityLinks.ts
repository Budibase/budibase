import {
  context,
  redis,
  tenancy,
  utils,
  type RedisClient,
} from "@budibase/backend-core"
import {
  AgentChannelProvider,
  type ChatIdentityLink,
  type ChatIdentityLinkLookupInput,
  type ChatIdentityLinkProvider,
  type ChatIdentityLinkSession,
  type ChatIdentityProviderRedirectInput,
  type CreateChatIdentityLinkSessionInput,
  type UpsertChatIdentityLinkInput,
} from "@budibase/types"
import { DocumentType } from "@budibase/types"

const CHAT_LINK_SESSION_CACHE_KEY_PREFIX = "chatIdentityLinkSession"
const CHAT_LINK_SESSION_TTL_SECONDS = 10 * 60

const getProviderScopeKey = ({
  provider,
  teamId,
  providerTenantId,
}: {
  provider: ChatIdentityLinkProvider
  teamId?: string
  providerTenantId?: string
}) => {
  if (provider === AgentChannelProvider.SLACK) {
    return teamId
  }

  if (provider === AgentChannelProvider.MSTEAMS) {
    return providerTenantId || teamId
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

const getChatLinkSessionCacheClient = async (): Promise<RedisClient> =>
  await redis.clients.getCacheClient()

const storeSession = async (session: ChatIdentityLinkSession) => {
  const client = await getChatLinkSessionCacheClient()

  try {
    await client.store(
      getSessionCacheKey(session.token),
      session,
      CHAT_LINK_SESSION_TTL_SECONDS
    )
  } catch (error) {
    console.error("Failed to store chat identity link session", error)
    throw error
  }
}

const clearSession = async (token: string) => {
  const client = await getChatLinkSessionCacheClient()

  try {
    await client.delete(getSessionCacheKey(token))
  } catch (error) {
    console.error("Failed to clear chat identity link session", error)
  }
}

const loadSession = async (token: string) => {
  const client = await getChatLinkSessionCacheClient()

  try {
    const value = (await client.get(
      getSessionCacheKey(token)
    )) as ChatIdentityLinkSession | null

    if (!value || Date.now() >= new Date(value.expiresAt).getTime()) {
      await clearSession(token)
      return undefined
    }
    return value
  } catch (error) {
    console.error("Failed to load chat identity link session", error)
    return undefined
  }
}

export const buildChatIdentityProviderRedirectUrl = ({
  provider,
  teamId,
}: ChatIdentityProviderRedirectInput) => {
  if (provider === AgentChannelProvider.SLACK) {
    if (teamId) {
      return `https://app.slack.com/client/${encodeURIComponent(teamId)}`
    }
    return "https://slack.com/app_redirect"
  }
  if (provider === AgentChannelProvider.MSTEAMS) {
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
  const now = new Date()
  const expiresAt = new Date(
    now.getTime() + CHAT_LINK_SESSION_TTL_SECONDS * 1000
  ).toISOString()

  const session: ChatIdentityLinkSession = {
    token: utils.newid(),
    tenantId: context.getTenantId(),
    workspaceId,
    provider,
    externalUserId,
    externalUserName,
    teamId,
    guildId,
    providerTenantId,
    createdAt: now.toISOString(),
    expiresAt,
  }

  await storeSession(session)
  return session
}

export const getChatIdentityLinkSession = async (token: string) =>
  loadSession(token)

export const consumeChatIdentityLinkSession = async (token: string) => {
  const session = await loadSession(token)
  if (!session) {
    return undefined
  }
  if (session.tenantId !== context.getTenantId()) {
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
  const db = tenancy.getGlobalDB()

  const linkId = getLinkDocId({
    tenantId,
    provider,
    externalUserId,
    teamId,
    providerTenantId,
  })
  return await db.tryGet<ChatIdentityLink>(linkId)
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

  const db = tenancy.getGlobalDB()
  const linkId = getLinkDocId({
    tenantId,
    provider,
    externalUserId,
    teamId,
    providerTenantId,
  })
  const existing = await db.tryGet<ChatIdentityLink>(linkId)

  const now = new Date().toISOString()
  const next: ChatIdentityLink = {
    _id: linkId,
    ...(existing?._rev ? { _rev: existing._rev } : {}),
    tenantId,
    provider,
    externalUserId,
    globalUserId,
    linkedAt: now,
    linkedBy,
    externalUserName: externalUserName || existing?.externalUserName,
    teamId: teamId || existing?.teamId,
    guildId: guildId || existing?.guildId,
    providerTenantId: providerTenantId || existing?.providerTenantId,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  }

  const response = await db.put(next)
  return {
    ...next,
    _rev: response.rev,
  }
}
