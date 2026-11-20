import { features } from "@budibase/backend-core"
import { type Ctx, FeatureFlag } from "@budibase/types"
import type { Next } from "koa"

export async function projectTemplatesEnabled(ctx: Ctx, next: Next) {
  const [projectsEnabled, templatesEnabled] = await Promise.all([
    features.isEnabled(FeatureFlag.PROJECTS),
    features.isEnabled(FeatureFlag.TEMPLATES),
  ])
  if (!projectsEnabled || !templatesEnabled) {
    ctx.throw(404)
  }
  return next()
}
