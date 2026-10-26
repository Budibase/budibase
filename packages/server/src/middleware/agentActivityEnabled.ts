import { features } from "@budibase/backend-core"
import { Ctx, FeatureFlag } from "@budibase/types"
import { Next } from "koa"

export async function agentActivityEnabled(ctx: Ctx, next: Next) {
  if (!(await features.isEnabled(FeatureFlag.AI_AGENT_ACTIVITY))) {
    ctx.throw(404)
  }
  return next()
}
