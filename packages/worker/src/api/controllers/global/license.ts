import { licensing, quotas } from "@budibase/pro"
import {
  ActivateLicenseKeyRequest,
  ActivateOfflineLicenseRequest,
  GetLicenseKeyResponse,
  GetOfflineIdentifierResponse,
  GetOfflineLicenseResponse,
  UserCtx,
} from "@budibase/types"

// LICENSE KEY

export async function activateLicenseKey(ctx: UserCtx<ActivateLicenseKeyRequest>) {
  const { licenseKey } = ctx.request.body
  await licensing.keys.activateLicenseKey(licenseKey)
  ctx.status = 200
}

export async function getLicenseKey(ctx: UserCtx<void, GetLicenseKeyResponse>) {
  const licenseKey = await licensing.keys.getLicenseKey()
  if (licenseKey) {
    ctx.body = { licenseKey: "*" }
    ctx.status = 200
  } else {
    ctx.status = 404
  }
}

export async function deleteLicenseKey(ctx: UserCtx<void, void>) {
  await licensing.keys.deleteLicenseKey()
  ctx.status = 204
}

// OFFLINE LICENSE

export async function activateOfflineLicense(ctx: UserCtx<ActivateOfflineLicenseRequest>) {
  const { offlineLicenseToken } = ctx.request.body
  await licensing.offline.activateOfflineLicense(offlineLicenseToken)
  ctx.status = 200
}

export async function getOfflineLicense(ctx: UserCtx<void, GetOfflineLicenseResponse>) {
  const offlineLicenseToken = await licensing.offline.getOfflineLicenseToken()
  if (offlineLicenseToken) {
    ctx.body = { offlineLicenseToken: "*" }
    ctx.status = 200
  } else {
    ctx.status = 404
  }
}

export async function deleteOfflineLicense(ctx: UserCtx<void, void>) {
  await licensing.offline.deleteOfflineLicenseToken()
  ctx.status = 204
}

export async function getOfflineLicenseIdentifier(ctx: UserCtx<void, GetOfflineIdentifierResponse>) {
  const identifierBase64 = await licensing.offline.getIdentifierBase64()
  ctx.body = { identifierBase64 }
  ctx.status = 200
}

// LICENSES

export const refresh = async (ctx: any) => {
  await licensing.cache.refresh()
  ctx.status = 200
}

// USAGE

export const getQuotaUsage = async (ctx: any) => {
  ctx.body = await quotas.getQuotaUsage()
  ctx.status = 200
}
