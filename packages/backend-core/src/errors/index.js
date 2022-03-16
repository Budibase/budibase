const licensing = require("./licensing")

const codes = {
  ...licensing.codes,
}

const types = {
  ...licensing.types,
}

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

    if (err.code) {
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
  UsageLimitError: licensing.UsageLimitError,
  getPublicError,
}
