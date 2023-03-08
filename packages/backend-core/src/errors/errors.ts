import * as licensing from "./licensing"

// combine all error codes into single object

export const codes = {
  ...licensing.codes,
}

// combine all error types
export const types = [licensing.type]

// combine all error contexts
const context = {
  ...licensing.context,
}

// derive a public error message using codes, types and any custom contexts
export const getPublicError = (err: any) => {
  let error
  if (err.code || err.type) {
    // add generic error information
    error = {
      code: err.code,
      type: err.type,
    }

    if (err.code && context[err.code]) {
      error = {
        ...error,
        // get any additional context from this error
        ...context[err.code](err),
      }
    }
  }

  return error
}
