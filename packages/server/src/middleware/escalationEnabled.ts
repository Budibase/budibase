import { Next } from "koa"
import { features } from "@budibase/backend-core"
import { Ctx, FeatureFlag } from "@budibase/types"

export async function escalationEnabled(ctx: Ctx, next: Next) {
  if (!(await features.isEnabled(FeatureFlag.ESCALATION))) {
    ctx.throw(403, "Escalation feature is disabled")
  }
  return next()
}
