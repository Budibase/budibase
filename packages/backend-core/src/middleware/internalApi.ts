import { Header } from "../constants"
import { Ctx } from "@budibase/types"
import { isValidInternalAPIKey } from "../utils"

/**
 * API Key only endpoint.
 */
export default async (ctx: Ctx, next: any) => {
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
