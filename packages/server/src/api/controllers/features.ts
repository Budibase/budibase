import {
  UserCtx,
  OverrideFeatureFlagRequest,
  FeatureFlagCookie,
} from "@budibase/types"
import { Cookie, utils } from "@budibase/backend-core"

export async function override(ctx: UserCtx<OverrideFeatureFlagRequest, void>) {
  const { flags } = ctx.request.body

  let cookie = utils.getCookie<FeatureFlagCookie>(ctx, Cookie.FeatureFlags)
  if (!cookie) {
    cookie = {
      flags: {},
    }
  }

  cookie.flags = {
    ...cookie.flags,
    ...flags,
  }

  utils.setCookie(ctx, cookie, Cookie.FeatureFlags)

  ctx.status = 200
}
