import { features } from "@budibase/backend-core"
import { FeatureFlag, type Ctx } from "@budibase/types"
import type { Next } from "koa"

export const featureFlagOverridesEnabled = async (ctx: Ctx, next: Next) => {
  if (
    !(await features.isEnabledWithoutOverrides(
      FeatureFlag.FEATURE_FLAG_OVERRIDES
    ))
  ) {
    ctx.throw(403, "Feature flag overrides are disabled")
  }
  return await next()
}
