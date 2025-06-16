import { Ctx, LicenseFlagCookie } from "@budibase/types"
import { Middleware, Next } from "koa"
import { getCookie } from "../utils"
import { Cookie } from "../constants"
import { doInLicenseFlagOverrideContext } from "../context"

export default (async (ctx: Ctx, next: Next) => {
  const cookie = getCookie<LicenseFlagCookie>(ctx, Cookie.LicenseFlags)
  await doInLicenseFlagOverrideContext(cookie?.flags || {}, async () => {
    await next()
  })
}) as Middleware
