import type { RouterMiddleware } from "@koa/router"
import { context, env } from "@budibase/backend-core"
import { Ctx } from "@budibase/types"
import { Next } from "koa"
import { logger } from "../sdk/scim"

export const doInScimContext: RouterMiddleware<any, any> = async (
  ctx: Ctx,
  next: Next
) => {
  let logId: string | undefined
  if (env.ENABLE_SCIM_LOGGER) {
    logId = await logger.logRequest({
      // koa response stringify only returns status, message and header
      ...ctx.request.toJSON(),
      body: ctx.request.body,
    })
  }
  return await context.doInScimContext(async () => {
    const result = await next()

    if (logId) {
      await logger.logResponse(logId, {
        // koa response stringify only returns status, message and header
        ...ctx.response.toJSON(),
        body: ctx.response.body,
      })
    }
    return result
  })
}
