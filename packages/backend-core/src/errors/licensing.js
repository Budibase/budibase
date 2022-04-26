const { BudibaseError } = require("./base")

const types = {
  LICENSE_ERROR: "license_error",
}

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

class UsageLimitError extends BudibaseError {
  constructor(message, limitName) {
    super(message, types.LICENSE_ERROR, codes.USAGE_LIMIT_EXCEEDED)
    this.limitName = limitName
    this.status = 400
  }
}

module.exports = {
  types,
  codes,
  context,
  UsageLimitError,
}
