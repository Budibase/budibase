import { Ctx } from "@budibase/types"

/**
 * Expects a standard "query" query string property which is the JSON body
 * of the request, which has to be sent via query string due to the requirement
 * of making an endpoint a GET request e.g. downloading a file stream.
 */
export default function (ctx: Ctx, next: any) {
  const queryString = ctx.request.query?.query as string | undefined
  if (ctx.request.method.toLowerCase() !== "get") {
    ctx.throw(
      500,
      "Query to download middleware can only be used for get requests."
    )
  }
  if (!queryString) {
    return next()
  }
  const decoded = decodeURIComponent(queryString)
  let json
  try {
    json = JSON.parse(decoded)
  } catch (err) {
    return next()
  }
  ctx.request.body = json
  return next()
}
