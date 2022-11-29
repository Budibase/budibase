import env from "../environment"
import { Header } from "../constants"
import { BBContext } from "@budibase/types"

/**
 * API Key only endpoint.
 */
export = async (ctx: BBContext, next: any) => {
  const apiKey = ctx.request.headers[Header.API_KEY]
  if (apiKey !== env.INTERNAL_API_KEY) {
    ctx.throw(403, "Unauthorized")
  }

  return next()
}
