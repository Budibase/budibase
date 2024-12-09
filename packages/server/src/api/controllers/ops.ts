import { Ctx, LogOpsRequest, ErrorOpsRequest } from "@budibase/types"
import { logging } from "@budibase/backend-core"

export async function log(ctx: Ctx<LogOpsRequest, void>) {
  const body = ctx.request.body
  console.trace(body.message, body.data)
  console.debug(body.message, body.data)
  console.info(body.message, body.data)
  console.warn(body.message, body.data)
  console.error(body.message, body.data)
  ctx.status = 204
}

export async function alert(ctx: Ctx<ErrorOpsRequest, void>) {
  const body = ctx.request.body
  logging.logAlert(body.message, new Error(body.message))
  ctx.status = 204
}

export async function error(ctx: Ctx<ErrorOpsRequest, void>) {
  const body = ctx.request.body
  throw new Error(body.message)
}
