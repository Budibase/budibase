const { HTTPError } = require("./http")

const type = "license_error"

const codes = {
  USAGE_LIMIT_EXCEEDED: "usage_limit_exceeded",
}

const context = {
  [codes.USAGE_LIMIT_EXCEEDED]: err => {
    return {
      limitName: err.limitName,
    }
  },
}

class UsageLimitError extends HTTPError {
  constructor(message, limitName) {
    super(message, 400, codes.USAGE_LIMIT_EXCEEDED, type)
    this.limitName = limitName
  }
}

module.exports = {
  type,
  codes,
  context,
  UsageLimitError,
}
