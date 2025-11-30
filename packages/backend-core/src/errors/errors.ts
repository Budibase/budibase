// BASE

import { ErrorCode } from "@budibase/types"

export abstract class BudibaseError extends Error {
  code: string

  constructor(message: string, code: ErrorCode) {
    super(message)
    this.code = code
  }

  protected getPublicError?(): any
}

// ERROR HANDLING

/**
 * For the given error, build the public representation that is safe
 * to be exposed over an api.
 */
export const getPublicError = (err: any) => {
  let error
  if (err.code) {
    // add generic error information
    error = {
      code: err.code,
    }

    if (err.getPublicError) {
      error = {
        ...error,
        // get any additional context from this error
        ...err.getPublicError(),
      }
    }
  }

  return error
}

// HTTP

export class HTTPError extends BudibaseError {
  status: number

  constructor(message: string, httpStatus: number, code = ErrorCode.HTTP) {
    super(message, code)
    this.status = httpStatus
  }

  static async fromResponse(resp: Response) {
    const body = await resp.text()
    let message = body
    let httpStatus = resp.status
    let code = ErrorCode.HTTP
    try {
      const error = JSON.parse(body)
      message = error.message
      httpStatus = error.status
      code = error.error?.code
    } catch (e) {
      // ignore
    }
    return new HTTPError(message, httpStatus, code)
  }
}

export class UnexpectedError extends HTTPError {
  constructor(message: string) {
    super(message, 500)
  }
}

export class NotFoundError extends HTTPError {
  constructor(message: string) {
    super(message, 404)
  }
}

export class BadRequestError extends HTTPError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class ForbiddenError extends HTTPError {
  constructor(message: string) {
    super(message, 403)
  }
}

export class NotImplementedError extends HTTPError {
  constructor(message: string) {
    super(message, 501)
  }
}

// LICENSING
export class FeatureDisabledError extends Error {
  constructor(feature: string) {
    super(`Feature disabled: '${feature}'`)
  }
}

export class UsageLimitError extends Error {
  constructor(limitName: string) {
    super(`Usage limit exceeded: '${limitName}'`)
  }
}

// USERS

export class EmailUnavailableError extends Error {
  constructor(email: string) {
    super(`Email already in use: '${email}'`)
  }
}
