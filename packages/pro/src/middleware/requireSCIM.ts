import type { RouterMiddleware } from "@koa/router"
import type { Next } from "koa"
import * as features from "../sdk/features"

export const requireSCIM: RouterMiddleware = async (ctx: any, next: Next) => {
  await features.checkSCIM()
  await next()
}
