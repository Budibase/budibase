import { constants, db, utils } from "@budibase/backend-core"
import { Ctx, ServiceApiKeyAccessLevel } from "@budibase/types"

export function publicApiMiddleware({
  requiresAppId,
  accessLevel,
  tenantLevel,
  workspaceLevel,
}: {
  requiresAppId?: boolean
  accessLevel?: ServiceApiKeyAccessLevel
  tenantLevel?: boolean
  workspaceLevel?: boolean
} = {}) {
  return async (ctx: Ctx, next: () => void) => {
    const appId = await utils.getWorkspaceIdFromCtx(ctx)
    if (requiresAppId && !appId) {
      ctx.throw(
        400,
        `Invalid app ID provided, please check the ${constants.Header.WORKSPACE_ID} header.`
      )
    }
    if (!ctx.headers[constants.Header.API_KEY]) {
      ctx.throw(
        400,
        `Invalid API key provided, please check the ${constants.Header.API_KEY} header.`
      )
    }
    const serviceApiKey = ctx.serviceApiKey
    if (serviceApiKey) {
      if (
        accessLevel === ServiceApiKeyAccessLevel.READ_WRITE &&
        serviceApiKey.accessLevel !== ServiceApiKeyAccessLevel.READ_WRITE
      ) {
        ctx.throw(403, "Service API key does not have write access")
      }
      const isTenantOperation =
        tenantLevel || (workspaceLevel && !ctx.params?.appId) || !appId
      if (isTenantOperation) {
        if (!serviceApiKey.tenantAdmin) {
          ctx.throw(
            403,
            "Service API key does not have tenant administration access"
          )
        }
      } else if (
        serviceApiKey.workspaceAccess.type === "selected" &&
        !serviceApiKey.workspaceAccess.workspaceIds.includes(
          db.getProdWorkspaceID(appId)
        )
      ) {
        ctx.throw(403, "Service API key does not have access to this workspace")
      }
      ctx.serviceApiKeyAuthorized = true
    }
    return next()
  }
}
