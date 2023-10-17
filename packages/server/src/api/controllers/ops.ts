import { Ctx } from "@budibase/types"
import { logging } from "@budibase/backend-core"

interface LogRequest {
  message: string
  data?: any
}

interface ErrorRequest {
  message: string
}

export async function log(ctx: Ctx<LogRequest>) {
  const body = ctx.request.body
  console.trace(body.message, body.data)
  console.debug(body.message, body.data)
  console.info(body.message, body.data)
  console.warn(body.message, body.data)
  console.error(body.message, body.data)
  ctx.status = 204
}

export async function alert(ctx: Ctx<ErrorRequest>) {
  const body = ctx.request.body
  logging.logAlert(body.message, new Error(body.message))
  ctx.status = 204
}

export async function error(ctx: Ctx<ErrorRequest>) {
  const body = ctx.request.body
  throw new Error(body.message)
}
