import {
  UserCtx,
  OverrideFeatureFlagRequest,
  FeatureFlagCookie,
  FeatureFlag,
} from "@budibase/types"
import { Cookie, features, HTTPError, utils } from "@budibase/backend-core"

export async function override(ctx: UserCtx<OverrideFeatureFlagRequest, void>) {
  if (!(await features.isEnabled(FeatureFlag.DEBUG_UI))) {
    throw new HTTPError("Feature flag override is not allowed", 403)
  }

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
