import { features } from "@budibase/backend-core"
import { FeatureFlag, type Ctx } from "@budibase/types"
import type { Next } from "koa"

export const debugUIEnabled = async (ctx: Ctx, next: Next) => {
  if (!(await features.isEnabledWithoutOverrides(FeatureFlag.DEBUG_UI))) {
    ctx.throw(403, "Debug UI feature is disabled")
  }
  return await next()
}
