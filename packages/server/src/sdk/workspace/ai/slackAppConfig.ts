import { context, encryption, HTTPError, tenancy } from "@budibase/backend-core"
import {
  DocumentType,
  PASSWORD_REPLACEMENT,
  type SlackAppConfig,
} from "@budibase/types"
import { rotateSlackConfigToken } from "./deployments/slack"

const SECRET_ENCODING_PREFIX = "bbai_enc::"
const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000

const getDocId = (tenantId: string) =>
  `${DocumentType.SLACK_APP_CONFIG}_${encodeURIComponent(tenantId)}`

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
  return await db.tryGet<SlackAppConfig>(getDocId(tenantId))
}

const tokenNeedsRotation = (expiresAt?: string) => {
  if (!expiresAt) {
    return false
  }
  return new Date(expiresAt).getTime() <= Date.now() + TOKEN_EXPIRY_BUFFER_MS
}

const saveRotatedConfig = async (
  existing: SlackAppConfig,
  rotated: {
    configToken: string
    refreshToken: string
    expiresAt: string
  }
) => {
  const db = tenancy.getGlobalDB()
  const next: SlackAppConfig = {
    ...existing,
    configToken: encodeSecret(rotated.configToken),
    refreshToken: encodeSecret(rotated.refreshToken),
    expiresAt: rotated.expiresAt,
    updatedAt: new Date().toISOString(),
  }
  const response = await db.put(next)
  return {
    ...next,
    _rev: response.rev,
  }
}

export const fetchConfigToken = async () => {
  const config = await fetch()
  if (!config?.configToken) {
    throw new HTTPError(
      "Slack app configuration token is not configured for this tenant",
      400
    )
  }

  if (!tokenNeedsRotation(config.expiresAt) && config.expiresAt) {
    return decodeSecret(config.configToken)
  }

  if (!config.refreshToken) {
    if (config.expiresAt) {
      throw new HTTPError(
        "Slack app configuration token has expired. Save a new config token and refresh token.",
        400
      )
    }
    return decodeSecret(config.configToken)
  }

  const rotated = await rotateSlackConfigToken({
    refreshToken: decodeSecret(config.refreshToken),
  })
  return decodeSecret((await saveRotatedConfig(config, rotated)).configToken)
}

export const save = async (configToken: string, refreshToken: string) => {
  const tenantId = context.getTenantId()
  const db = tenancy.getGlobalDB()
  const existing = await fetch()
  const now = new Date().toISOString()
  const trimmedToken = configToken.trim()
  const trimmedRefreshToken = refreshToken.trim()
  if (!trimmedToken) {
    throw new HTTPError("Slack app configuration token is required", 400)
  }
  if (!trimmedRefreshToken) {
    throw new HTTPError(
      "Slack app configuration refresh token is required",
      400
    )
  }
  if (trimmedToken === PASSWORD_REPLACEMENT && !existing?.configToken) {
    throw new HTTPError("Slack app configuration token is required", 400)
  }
  if (trimmedRefreshToken === PASSWORD_REPLACEMENT && !existing?.refreshToken) {
    throw new HTTPError(
      "Slack app configuration refresh token is required",
      400
    )
  }

  const rotated = await rotateSlackConfigToken({
    refreshToken:
      trimmedRefreshToken === PASSWORD_REPLACEMENT && existing?.refreshToken
        ? decodeSecret(existing.refreshToken)
        : trimmedRefreshToken,
  })

  const next: SlackAppConfig = {
    _id: getDocId(tenantId),
    ...(existing?._rev ? { _rev: existing._rev } : {}),
    tenantId,
    configToken: encodeSecret(rotated.configToken),
    refreshToken: encodeSecret(rotated.refreshToken),
    expiresAt: rotated.expiresAt,
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
