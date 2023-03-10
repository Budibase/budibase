import { Header } from "../constants"
import { BBContext } from "@budibase/types"
import { isValidInternalAPIKey } from "../utils"

/**
 * API Key only endpoint.
 */
export default async (ctx: BBContext, next: any) => {
  const apiKey = ctx.request.headers[Header.API_KEY]
  if (!apiKey) {
    ctx.throw(403, "Unauthorized")
  }

  if (Array.isArray(apiKey)) {
    ctx.throw(403, "Unauthorized")
  }

  if (!isValidInternalAPIKey(apiKey)) {
    ctx.throw(403, "Unauthorized")
  }

  return next()
}
