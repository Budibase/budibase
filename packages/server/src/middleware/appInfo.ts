import { isDevAppID, isProdAppID } from "../db/utils"
import { Ctx } from "@budibase/types"

export enum AppType {
  DEV = "dev",
  PROD = "prod",
}

export function middleware({ appType }: { appType?: AppType } = {}) {
  return (ctx: Ctx, next: any) => {
    const appId = ctx.appId
    if (appType === AppType.DEV && appId && !isDevAppID(appId)) {
      ctx.throw(400, "Only apps in development support this endpoint")
    }
    if (appType === AppType.PROD && appId && !isProdAppID(appId)) {
      ctx.throw(400, "Only apps in production support this endpoint")
    }
    return next()
  }
}
