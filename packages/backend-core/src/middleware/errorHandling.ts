import { APIError } from "@budibase/types"
import * as errors from "../errors"
import env from "../environment"

export async function errorHandling(ctx: any, next: any) {
  try {
    await next()
  } catch (err: any) {
    const status = err.status || err.statusCode || 500
    ctx.status = status

    if (status > 499 || env.ENABLE_4XX_HTTP_LOGGING) {
      ctx.log.error(err)
    }

    const error = errors.getPublicError(err)
    const body: APIError = {
      message: err.message,
      status: status,
      validationErrors: err.validation,
      error,
    }

    ctx.body = body
  }
}

export default errorHandling
