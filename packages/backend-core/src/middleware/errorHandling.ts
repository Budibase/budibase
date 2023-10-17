import { APIError } from "@budibase/types"
import * as errors from "../errors"

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
