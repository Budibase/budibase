import { HTTPError } from "./http"
import { UsageLimitError, FeatureDisabledError } from "./licensing"
import * as licensing from "./licensing"

const codes = {
  ...licensing.codes,
}

const types = [licensing.type]

const context = {
  ...licensing.context,
}

const getPublicError = (err: any) => {
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

const pkg = {
  codes,
  types,
  errors: {
    UsageLimitError,
    FeatureDisabledError,
    HTTPError,
  },
  getPublicError,
}

export = pkg
