import { licensing, quotas } from "@budibase/pro"

export const activate = async (ctx: any) => {
  const { licenseKey } = ctx.request.body
  if (!licenseKey) {
    ctx.throw(400, "licenseKey is required")
  }

  await licensing.activateLicenseKey(licenseKey)
  ctx.status = 200
}

export const refresh = async (ctx: any) => {
  await licensing.cache.refresh()
  ctx.status = 200
}

export const getInfo = async (ctx: any) => {
  const licenseInfo = await licensing.getLicenseInfo()
  if (licenseInfo) {
    licenseInfo.licenseKey = "*"
    ctx.body = licenseInfo
  }
  ctx.status = 200
}

export const deleteInfo = async (ctx: any) => {
  await licensing.deleteLicenseInfo()
  ctx.status = 200
}

export const getQuotaUsage = async (ctx: any) => {
  ctx.body = await quotas.getQuotaUsage()
}
