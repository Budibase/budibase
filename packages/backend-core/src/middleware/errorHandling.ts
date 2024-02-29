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

    let error: APIError = {
      message: err.message,
      status: status,
      validationErrors: err.validation,
      error: errors.getPublicError(err),
    }

    if (environment.isTest() && ctx.headers["x-budibase-include-stacktrace"]) {
      // @ts-ignore
      error.stack = err.stack
    }

    ctx.body = error
  }
}

export default errorHandling
