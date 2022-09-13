import { HTTPError } from "./http"

export const type = "license_error"

export const codes = {
  USAGE_LIMIT_EXCEEDED: "usage_limit_exceeded",
  FEATURE_DISABLED: "feature_disabled",
}

export const context = {
  [codes.USAGE_LIMIT_EXCEEDED]: (err: any) => {
    return {
      limitName: err.limitName,
    }
  },
  [codes.FEATURE_DISABLED]: (err: any) => {
    return {
      featureName: err.featureName,
    }
  },
}

export class UsageLimitError extends HTTPError {
  limitName: string

  constructor(message: string, limitName: string) {
    super(message, 400, codes.USAGE_LIMIT_EXCEEDED, type)
    this.limitName = limitName
  }
}

export class FeatureDisabledError extends HTTPError {
  featureName: string

  constructor(message: string, featureName: string) {
    super(message, 400, codes.FEATURE_DISABLED, type)
    this.featureName = featureName
  }
}
