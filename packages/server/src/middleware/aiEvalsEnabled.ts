import { Next } from "koa"
import { features } from "@budibase/backend-core"
import { Ctx, FeatureFlag } from "@budibase/types"

export async function aiEvalsEnabled(ctx: Ctx, next: Next) {
  if (!(await features.isEnabled(FeatureFlag.AI_EVALS))) {
    ctx.throw(403, "Evaluations feature is disabled")
  }
  return next()
}
