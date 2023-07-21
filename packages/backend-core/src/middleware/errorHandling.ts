import { APIError, LogLevel } from "@budibase/types"
import * as errors from "../errors"

export const logFunction: { [key in LogLevel]: any }= {
  [LogLevel.TRACE]: console.trace,
  [LogLevel.DEBUG]: console.debug,
  [LogLevel.INFO]: console.info,
  [LogLevel.WARN]: console.warn,
  [LogLevel.ERROR]: console.error,
}

export async function errorHandling(ctx: any, next: any) {
  try {
    await next()
  } catch (err: any) {
    const status = err.status || err.statusCode || 500
    ctx.status = status

    if (err.logLevel) {
      logFunction[err.logLevel as LogLevel](err)
    } else if (status >= 400 && status < 500) {
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
