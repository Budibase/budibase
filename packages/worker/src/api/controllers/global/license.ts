import * as Pro from "@budibase/pro"

export const activate = async (ctx: any) => {
  const { licenseKey } = ctx.request.body
  if (!licenseKey) {
    ctx.throw(400, "licenseKey is required")
  }

  await Pro.Licensing.activateLicenseKey(licenseKey)
  ctx.status = 200
}

export const refresh = async (ctx: any) => {
  await Pro.Licensing.Cache.refresh()
  ctx.status = 200
}

export const getInfo = async (ctx: any) => {
  const licenseInfo = await Pro.Licensing.getLicenseInfo()
  if (licenseInfo) {
    licenseInfo.licenseKey = "*"
    ctx.body = licenseInfo
  }
  ctx.status = 200
}
