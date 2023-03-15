// BASE

export abstract class BudibaseError extends Error {
  code: string

  constructor(message: string, code: string) {
    super(message)
    this.code = code
  }

  abstract getPublicError(): any
}

// ERROR HANDLING

export const codes = {
  USAGE_LIMIT_EXCEEDED: "usage_limit_exceeded",
  FEATURE_DISABLED: "feature_disabled",
}

/**
 * For the given error, build the public representation that is safe
 * to be exposed over an api.
 */
export const getPublicError = (err: any) => {
  let error
  if (err.code) {
    // add generic error information
    error = {
      code: err.code
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

  constructor(
    message: string,
    httpStatus: number,
    code = "http",
  ) {
    super(message, code)
    this.status = httpStatus
  }

  getPublicError() {
    return {
      status: this.status
    }
  }
}

// LICENSING

export class UsageLimitError extends HTTPError {
  limitName: string

  constructor(message: string, limitName: string) {
    super(message, 400, codes.USAGE_LIMIT_EXCEEDED)
    this.limitName = limitName
  }

  getPublicError() {
    return {
      ...super.getPublicError(),
      status: this.status
    }
  }
}

export class FeatureDisabledError extends HTTPError {
  featureName: string

  constructor(message: string, featureName: string) {
    super(message, 400, codes.FEATURE_DISABLED)
    this.featureName = featureName
  }

  getPublicError() {
    return {
      ...super.getPublicError(),
      featureName: this.featureName
    }
  }
}
