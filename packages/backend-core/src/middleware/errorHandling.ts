import { APIError } from "@budibase/types"
import * as errors from "../errors"
import environment from "../environment"

export async function errorHandling(ctx: any, next: any) {
  try {
    await next()
  } catch (err: any) {
    const status = err.status || err.statusCode || 500
    ctx.status = status

    if (status >= 400 && status < 500) {
      console.warn(err)
    } else {
      console.error(err)
    }

    if (environment.isTest()) {
      ctx.body = {
        message: err.message,
        status: status,
        error: errors.getPublicError(err),
        stack: err.stack,
      }
    } else {
      ctx.body = {
        message: err.message,
        status: status,
        validationErrors: err.validation,
        error: errors.getPublicError(err),
      }
    }
  }
}

export default errorHandling
