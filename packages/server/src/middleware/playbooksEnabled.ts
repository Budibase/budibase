import { features } from "@budibase/backend-core"
import { Ctx, FeatureFlag } from "@budibase/types"
import { Next } from "koa"

export async function playbooksEnabled(ctx: Ctx, next: Next) {
  if (!(await features.isEnabled(FeatureFlag.PLAYBOOKS))) {
    ctx.throw(404)
  }
  return next()
}
