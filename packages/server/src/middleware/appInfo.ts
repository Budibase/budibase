import { Ctx } from "@budibase/types"
import { isDevWorkspaceID, isProdWorkspaceID } from "../db/utils"

export enum AppType {
  DEV = "dev",
  PROD = "prod",
}

export function middleware({ appType }: { appType?: AppType } = {}) {
  return (ctx: Ctx, next: any) => {
    const workspaceId = ctx.appId
    if (
      appType === AppType.DEV &&
      workspaceId &&
      !isDevWorkspaceID(workspaceId)
    ) {
      ctx.throw(400, "Only apps in development support this endpoint")
    }
    if (
      appType === AppType.PROD &&
      workspaceId &&
      !isProdWorkspaceID(workspaceId)
    ) {
      ctx.throw(400, "Only apps in production support this endpoint")
    }
    return next()
  }
}
