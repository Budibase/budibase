import { Next } from "koa"
import { features } from "@budibase/backend-core"
import { Ctx, FeatureFlag } from "@budibase/types"

export async function aiTestsEnabled(ctx: Ctx, next: Next) {
  if (!(await features.isEnabled(FeatureFlag.AI_TESTS))) {
    ctx.throw(403, "Tests feature is disabled")
  }
  return next()
}
