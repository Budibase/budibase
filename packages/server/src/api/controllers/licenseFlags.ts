import { UserCtx, LicenseFlagCookie, FeatureFlag } from "@budibase/types"
import { Cookie, HTTPError, features } from "@budibase/backend-core"
import { utils } from "@budibase/backend-core"

export interface OverrideLicenseFlagRequest {
  features: Record<string, boolean>
}

export async function override(ctx: UserCtx<OverrideLicenseFlagRequest, void>) {
  if (!(await features.isEnabled(FeatureFlag.DEBUG_UI))) {
    throw new HTTPError("Feature flag override is not allowed", 403)
  }

  const { features: flags } = ctx.request.body

  let cookie = utils.getCookie<LicenseFlagCookie>(ctx, Cookie.LicenseFlags)
  if (!cookie) {
    cookie = { flags: {} }
  }

  cookie.flags = {
    ...cookie.flags,
    ...flags,
  }

  utils.setCookie(ctx, cookie, Cookie.LicenseFlags)
  ctx.status = 200
}
