const http = require("./http")
const licensing = require("./licensing")

const codes = {
  ...licensing.codes,
}

const types = [licensing.type]

const context = {
  ...licensing.context,
}

const getPublicError = err => {
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

module.exports = {
  codes,
  types,
  errors: {
    UsageLimitError: licensing.UsageLimitError,
    FeatureDisabledError: licensing.FeatureDisabledError,
    HTTPError: http.HTTPError,
  },
  getPublicError,
}
