import { context, encryption, HTTPError, tenancy } from "@budibase/backend-core"
import {
  DocumentType,
  PASSWORD_REPLACEMENT,
  type MSTeamsAppConfig,
} from "@budibase/types"

const SECRET_ENCODING_PREFIX = "bbai_enc::"

const getDocId = (tenantId: string) =>
  `${DocumentType.MS_TEAMS_APP_CONFIG}_${encodeURIComponent(tenantId)}`

const encodeSecret = (value: string): string => {
  if (!value || value.startsWith(SECRET_ENCODING_PREFIX)) {
    return value
  }
  return `${SECRET_ENCODING_PREFIX}${encryption.encrypt(value)}`
}

const decodeSecret = (value: string): string => {
  if (!value || !value.startsWith(SECRET_ENCODING_PREFIX)) {
    return value
  }
  return encryption.decrypt(value.slice(SECRET_ENCODING_PREFIX.length))
}

export const fetch = async () => {
  const tenantId = context.getTenantId()
  const db = tenancy.getGlobalDB()
  return await db.tryGet<MSTeamsAppConfig>(getDocId(tenantId))
}

export const fetchConfig = async () => {
  const config = await fetch()
  if (!config?.clientSecret) {
    throw new HTTPError(
      "Microsoft Teams app provisioning is not configured for this tenant",
      400
    )
  }

  return {
    ...config,
    clientSecret: decodeSecret(config.clientSecret),
  }
}

export const save = async ({
  azureTenantId,
  clientId,
  clientSecret,
  subscriptionId,
  resourceGroupName,
  location,
}: Omit<
  MSTeamsAppConfig,
  "_id" | "_rev" | "tenantId" | "createdAt" | "updatedAt"
>) => {
  const tenantId = context.getTenantId()
  const db = tenancy.getGlobalDB()
  const existing = await fetch()
  const now = new Date().toISOString()
  const trimmedClientSecret = clientSecret.trim()

  if (trimmedClientSecret === PASSWORD_REPLACEMENT && !existing?.clientSecret) {
    throw new HTTPError("Microsoft Teams client secret is required", 400)
  }

  const next: MSTeamsAppConfig = {
    _id: getDocId(tenantId),
    ...(existing?._rev ? { _rev: existing._rev } : {}),
    tenantId,
    azureTenantId: azureTenantId.trim(),
    clientId: clientId.trim(),
    clientSecret: encodeSecret(
      trimmedClientSecret === PASSWORD_REPLACEMENT && existing?.clientSecret
        ? existing.clientSecret
        : trimmedClientSecret
    ),
    subscriptionId: subscriptionId.trim(),
    resourceGroupName: resourceGroupName.trim(),
    location: location.trim(),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  }

  const response = await db.put(next)
  return {
    ...next,
    _rev: response.rev,
  }
}

export const remove = async () => {
  const existing = await fetch()
  if (!existing) {
    return
  }
  const db = tenancy.getGlobalDB()
  await db.remove(existing)
}
