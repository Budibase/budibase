const { BudibaseError } = require("./base")

const types = {
  LICENSE_ERROR: "license_error",
}

const codes = {
  USAGE_LIMIT_EXCEEDED: "usage_limit_exceeded",
}

class UsageLimitError extends BudibaseError {
  constructor(message, limitName) {
    super(message, types.LICENSE_ERROR, codes.USAGE_LIMIT_EXCEEDED)
    this.limitName = limitName
  }
}

module.exports = {
  types,
  codes,
  UsageLimitError,
}
