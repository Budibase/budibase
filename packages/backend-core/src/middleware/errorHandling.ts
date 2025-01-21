import { APIError } from "@budibase/types"
import * as errors from "../errors"
import environment from "../environment"
import { stringContainsSecret } from "../security/secrets"

export async function errorHandling(ctx: any, next: any) {
  try {
    await next()
  } catch (err: any) {
    const status = err.status || err.statusCode || 500
    ctx.status = status

    if (status >= 400 && status < 500) {
      console.warn(err)
    } else {
      console.error("Got 400 response code", err)
    }

    let error: APIError = {
      message: err.message,
      status,
      validationErrors: err.validation,
      error: errors.getPublicError(err),
    }

    if (stringContainsSecret(JSON.stringify(error))) {
      error = {
        message: "Unexpected error",
        status,
        error: "Unexpected error",
      }
    }

    if (environment.isTest() && ctx.headers["x-budibase-include-stacktrace"]) {
      let rootErr = err
      while (rootErr.cause) {
        rootErr = rootErr.cause
      }
      // @ts-ignore
      error.stack = rootErr.stack
    }

    ctx.body = error
  }
}

export default errorHandling
