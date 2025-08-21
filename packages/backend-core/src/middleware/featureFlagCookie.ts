import { Ctx, FeatureFlagCookie } from "@budibase/types"
import { Middleware, Next } from "koa"
import { getCookie } from "../utils"
import { Cookie } from "../constants"
import { doInFeatureFlagOverrideContext } from "../context"

export const featureFlagCookie = (async (ctx: Ctx, next: Next) => {
  const cookie = getCookie<FeatureFlagCookie>(ctx, Cookie.FeatureFlags)
  const flags = cookie?.flags || {}
  await doInFeatureFlagOverrideContext(flags, async () => {
    await next()
  })
}) as Middleware
