import { licensing, quotas } from "@budibase/pro"
import {
  ActivateLicenseKeyRequest,
  ActivateLicenseKeyResponse,
  ActivateOfflineLicenseTokenRequest,
  ActivateOfflineLicenseTokenResponse,
  GetLicenseKeyResponse,
  GetOfflineIdentifierResponse,
  GetOfflineLicenseTokenResponse,
  GetQuotaUsageResponse,
  RefreshOfflineLicenseResponse,
  UserCtx,
} from "@budibase/types"

// LICENSE KEY

export async function activateLicenseKey(
  ctx: UserCtx<ActivateLicenseKeyRequest, ActivateLicenseKeyResponse>
) {
  const { licenseKey } = ctx.request.body
  await licensing.keys.activateLicenseKey(licenseKey)
  ctx.body = {
    message: "License activated.",
  }
}

export async function getLicenseKey(ctx: UserCtx<void, GetLicenseKeyResponse>) {
  const licenseKey = await licensing.keys.getLicenseKey()
  if (licenseKey) {
    ctx.body = { licenseKey: "*" }
  } else {
    ctx.status = 404
  }
}

export async function deleteLicenseKey(ctx: UserCtx<void, void>) {
  await licensing.keys.deleteLicenseKey()
  ctx.status = 204
}

// OFFLINE LICENSE

export async function activateOfflineLicenseToken(
  ctx: UserCtx<
    ActivateOfflineLicenseTokenRequest,
    ActivateOfflineLicenseTokenResponse
  >
) {
  const { offlineLicenseToken } = ctx.request.body
  await licensing.offline.activateOfflineLicenseToken(offlineLicenseToken)
  ctx.body = {
    message: "License token activated.",
  }
}

export async function getOfflineLicenseToken(
  ctx: UserCtx<void, GetOfflineLicenseTokenResponse>
) {
  const offlineLicenseToken = await licensing.offline.getOfflineLicenseToken()
  if (offlineLicenseToken) {
    ctx.body = { offlineLicenseToken: "*" }
  } else {
    ctx.status = 404
  }
}

export async function deleteOfflineLicenseToken(ctx: UserCtx<void, void>) {
  await licensing.offline.deleteOfflineLicenseToken()
  ctx.status = 204
}

export async function getOfflineLicenseIdentifier(
  ctx: UserCtx<void, GetOfflineIdentifierResponse>
) {
  const identifierBase64 = await licensing.offline.getIdentifierBase64()
  ctx.body = { identifierBase64 }
}

// LICENSES

export const refresh = async (
  ctx: UserCtx<void, RefreshOfflineLicenseResponse>
) => {
  await licensing.cache.refresh()
  ctx.body = {
    message: "License refreshed.",
  }
}

// USAGE

export const getQuotaUsage = async (
  ctx: UserCtx<void, GetQuotaUsageResponse>
) => {
  ctx.body = await quotas.getQuotaUsage()
}
