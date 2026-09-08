import { Next } from "koa"
import { features } from "@budibase/backend-core"
import { Ctx, FeatureFlag } from "@budibase/types"
import env from "../environment"

export const areFunctionsEnabled = async () => {
  return Boolean(
    env.SELF_HOSTED &&
      env.BUDIBASE_FUNCTIONS_ENABLED &&
      (await features.isEnabled(FeatureFlag.FUNCTIONS))
  )
}

export const functionsEnabled = async (ctx: Ctx, next: Next) => {
  if (!(await areFunctionsEnabled())) {
    ctx.throw(404)
  }
  return next()
}
