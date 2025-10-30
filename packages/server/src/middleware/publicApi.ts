import { constants, utils } from "@budibase/backend-core"
import { Ctx } from "@budibase/types"

export function publicApiMiddleware({
  requiresAppId,
}: { requiresAppId?: boolean } = {}) {
  return async (ctx: Ctx, next: () => void) => {
    const appId = await utils.getWorkspaceIdFromCtx(ctx)
    if (requiresAppId && !appId) {
      ctx.throw(
        400,
        `Invalid app ID provided, please check the ${constants.Header.APP_ID} header.`
      )
    }
    if (!ctx.headers[constants.Header.API_KEY]) {
      ctx.throw(
        400,
        `Invalid API key provided, please check the ${constants.Header.API_KEY} header.`
      )
    }
    return next()
  }
}
