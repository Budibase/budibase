import {
  Ctx,
  IdentityType,
  UserCtx,
  OverrideFeatureFlagRequest,
  FeatureFlagCookie,
} from "@budibase/types"
import { context, Cookie, features, utils } from "@budibase/backend-core"

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

interface GetCloudFeatureFlagsRequest {
  userId?: string
}

interface GetCloudFeatureFlagsResponse {
  flags: Record<string, boolean>
}

export async function getCloudFlags(
  ctx: Ctx<GetCloudFeatureFlagsRequest, GetCloudFeatureFlagsResponse>
) {
  const { userId } = ctx.request.body
  const tenantId = context.getTenantId()

  const flagValues = userId
    ? await context.doInIdentityContext(
        {
          _id: userId,
          type: IdentityType.USER,
          tenantId,
        },
        async () => {
          return await features.all()
        }
      )
    : await features.all()

  ctx.body = {
    flags: flagValues,
  }
}
