import { licensing, quotas } from "@budibase/pro"
import {
  ActivateLicenseKeyRequest,
  ActivateOfflineLicenseRequest,
  GetLicenseKeyResponse,
  GetOfflineLicenseResponse,
  UserCtx,
} from "@budibase/types"

// LICENSE KEY

export async function activateLicenseKey(ctx: UserCtx<ActivateLicenseKeyRequest>) {
  const { licenseKey } = ctx.request.body
  await licensing.activateLicenseKey(licenseKey)
  ctx.status = 200
}

export async function getLicenseKey(ctx: UserCtx<void, GetLicenseKeyResponse>) {
  const licenseKey = await licensing.getLicenseKey()
  if (licenseKey) {
    ctx.body = { licenseKey: "*" }
    ctx.status = 200
  } else {
    ctx.status = 404
  }
}

export async function deleteLicenseKey(ctx: UserCtx<void, void>) {
  await licensing.deleteLicenseKey()
  ctx.status = 204
}

// OFFLINE LICENSE

export async function activateOfflineLicense(ctx: UserCtx<ActivateOfflineLicenseRequest>) {
  const { offlineLicense } = ctx.request.body
  await licensing.activateOfflineLicense(offlineLicense)
  ctx.status = 200
}

export async function getOfflineLicense(ctx: UserCtx<void, GetOfflineLicenseResponse>) {
  const offlineLicense = await licensing.getOfflineLicense()
  if (offlineLicense) {
    ctx.body = { offlineLicense: "*" }
    ctx.status = 200
  } else {
    ctx.status = 404
  }
}

export async function deleteOfflineLicense(ctx: UserCtx<void, void>) {
  await licensing.deleteOfflineLicense()
  ctx.status = 204
}

// LICENSES

export const refresh = async (ctx: any) => {
  await licensing.cache.refresh()
  ctx.status = 200
}

// USAGE

export const getQuotaUsage = async (ctx: any) => {
  ctx.body = await quotas.getQuotaUsage()
}
