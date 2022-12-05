import env from "../environment"
import { constants } from "@budibase/backend-core"
import { BBContext } from "@budibase/types"

/**
 * This is a restricted endpoint in the cloud.
 * Ensure that the correct API key has been supplied.
 */
export = async (ctx: BBContext, next: any) => {
  if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
    const apiKey = ctx.request.headers[constants.Header.API_KEY]
    if (apiKey !== env.INTERNAL_API_KEY) {
      ctx.throw(403, "Unauthorized")
    }
  }

  return next()
}
