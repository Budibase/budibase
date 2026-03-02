import { context, HTTPError } from "@budibase/backend-core"
import {
  ChannelIdentity,
  ChannelIdentityProvider,
  DocumentType,
  SEPARATOR,
} from "@budibase/types"

const DEFAULT_TENANT_SEGMENT = "global"

const normalize = (value?: string) => value?.trim() || undefined

const normalizeSegment = (value: string) => encodeURIComponent(value)

const buildChannelIdentityId = ({
  provider,
  externalUserId,
  tenantId,
}: {
  provider: ChannelIdentityProvider
  externalUserId: string
  tenantId?: string
}) => {
  const resolvedExternalUserId = normalize(externalUserId)
  if (!resolvedExternalUserId) {
    throw new HTTPError("externalUserId is required", 400)
  }

  const tenantSegment =
    provider === "msteams"
      ? normalizeSegment(normalize(tenantId) || DEFAULT_TENANT_SEGMENT)
      : DEFAULT_TENANT_SEGMENT

  return [
    DocumentType.CHANNEL_IDENTITY,
    provider,
    tenantSegment,
    normalizeSegment(resolvedExternalUserId),
  ].join(SEPARATOR)
}

const getLookupIds = ({
  provider,
  externalUserId,
  tenantId,
}: {
  provider: ChannelIdentityProvider
  externalUserId: string
  tenantId?: string
}) => {
  if (provider !== "msteams") {
    return [buildChannelIdentityId({ provider, externalUserId })]
  }

  const ids = [
    buildChannelIdentityId({
      provider,
      externalUserId,
      tenantId,
    }),
  ]
  if (tenantId) {
    ids.push(
      buildChannelIdentityId({
        provider,
        externalUserId,
      })
    )
  }
  console.log("ids", ids)
  return ids
}

export async function getByProviderExternalId({
  provider,
  externalUserId,
  tenantId,
}: {
  provider: ChannelIdentityProvider
  externalUserId: string
  tenantId?: string
}) {
  const db = context.getWorkspaceDB()
  const lookupIds = getLookupIds({
    provider,
    externalUserId,
    tenantId,
  })

  for (const lookupId of lookupIds) {
    const identity = await db.tryGet<ChannelIdentity>(lookupId)
    if (identity) {
      return identity
    }
  }

  return undefined
}

export async function upsert(
  identity: Omit<ChannelIdentity, "_id" | "_rev" | "createdAt" | "updatedAt">
): Promise<ChannelIdentity> {
  const resolvedExternalUserId = normalize(identity.externalUserId)
  const resolvedProvider = identity.provider
  if (!resolvedProvider) {
    throw new HTTPError("provider is required", 400)
  }
  if (!resolvedExternalUserId) {
    throw new HTTPError("externalUserId is required", 400)
  }
  const resolvedGlobalUserId = normalize(identity.globalUserId)
  if (!resolvedGlobalUserId) {
    throw new HTTPError("globalUserId is required", 400)
  }

  const db = context.getWorkspaceDB()
  const id = buildChannelIdentityId({
    provider: resolvedProvider,
    externalUserId: resolvedExternalUserId,
    tenantId: identity.tenantId,
  })
  const existing = await db.tryGet<ChannelIdentity>(id)
  const now = new Date().toISOString()

  const toSave: ChannelIdentity = {
    ...existing,
    ...identity,
    _id: id,
    provider: resolvedProvider,
    externalUserId: resolvedExternalUserId,
    globalUserId: resolvedGlobalUserId,
    tenantId: normalize(identity.tenantId),
    displayName: normalize(identity.displayName),
    email: normalize(identity.email),
    isActive: identity.isActive ?? existing?.isActive ?? true,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  }

  const response = await db.put(toSave)
  return {
    ...toSave,
    _rev: response.rev,
  }
}

export async function revoke({
  provider,
  externalUserId,
  tenantId,
}: {
  provider: ChannelIdentityProvider
  externalUserId: string
  tenantId?: string
}) {
  const existing = await getByProviderExternalId({
    provider,
    externalUserId,
    tenantId,
  })
  if (!existing?._id) {
    return undefined
  }

  return await upsert({
    provider: existing.provider,
    externalUserId: existing.externalUserId,
    tenantId: existing.tenantId,
    globalUserId: existing.globalUserId,
    displayName: existing.displayName,
    email: existing.email,
    isActive: false,
  })
}
