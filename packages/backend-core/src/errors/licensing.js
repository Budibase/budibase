const { HTTPError } = require("./http")

const type = "license_error"

const codes = {
  USAGE_LIMIT_EXCEEDED: "usage_limit_exceeded",
  FEATURE_DISABLED: "feature_disabled",
}

const context = {
  [codes.USAGE_LIMIT_EXCEEDED]: err => {
    return {
      limitName: err.limitName,
    }
  },
  [codes.FEATURE_DISABLED]: err => {
    return {
      featureName: err.featureName,
    }
  },
}

class UsageLimitError extends HTTPError {
  constructor(message, limitName) {
    super(message, 400, codes.USAGE_LIMIT_EXCEEDED, type)
    this.limitName = limitName
  }
}

class FeatureDisabledError extends HTTPError {
  constructor(message, featureName) {
    super(message, 400, codes.FEATURE_DISABLED, type)
    this.featureName = featureName
  }
}

module.exports = {
  type,
  codes,
  context,
  UsageLimitError,
  FeatureDisabledError,
}
