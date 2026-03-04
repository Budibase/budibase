import { Next } from "koa"
import { features } from "@budibase/backend-core"
import { Ctx, FeatureFlag } from "@budibase/types"

export async function aiRagEnabled(ctx: Ctx, next: Next) {
  if (!(await features.isEnabled(FeatureFlag.AI_RAG))) {
    ctx.throw(404)
  }
  return next()
}
