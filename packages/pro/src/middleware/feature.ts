import { Next } from "koa"
import { Feature } from "@budibase/types"
import * as features from "../sdk/features"

export const requireFeature = (featureFlag: Feature) => {
  return async (ctx: any, next: Next) => {
    await features.checkFeature(featureFlag)
    await next()
  }
}

export const requireFeatures = (...featureFlags: Feature[]) => {
  return async (ctx: any, next: Next) => {
    await features.checkFeatures(featureFlags)
    await next()
  }
}
