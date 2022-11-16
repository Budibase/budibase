import { isDevAppID, isProdAppID } from "../db/utils"
import { BBContext } from "@budibase/types"

export enum AppType {
  DEV = "dev",
  PROD = "prod",
}

export function middleware({ appType }: { appType?: AppType } = {}) {
  return (ctx: BBContext, next: any) => {
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
