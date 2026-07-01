import { features } from "@budibase/backend-core"
import { Ctx, FeatureFlag } from "@budibase/types"
import { Next } from "koa"

export async function projectsEnabled(ctx: Ctx, next: Next) {
  if (!(await features.isEnabled(FeatureFlag.PROJECTS))) {
    ctx.throw(404)
  }
  return next()
}
