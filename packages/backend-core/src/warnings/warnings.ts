// BASE

import { APIWarningCode } from "@budibase/types"

export abstract class APIWarning extends Error {
  code: string
  status?: number

  constructor(message: string, code: string) {
    super(message)
    this.code = code
  }

  protected getPublicWarning?(): any
}

// AUTH

export class InvalidAPIKeyWarning extends APIWarning {
  constructor() {
    super("Invalid API key", APIWarningCode.INVALID_API_KEY)
  }
}

// LICENSING

export class UsageLimitWarning extends APIWarning {
  limitName: string

  constructor(limitName: string) {
    super(
      `Usage limit exceeded: '${limitName}'`,
      APIWarningCode.USAGE_LIMIT_EXCEEDED
    )
    this.limitName = limitName
  }

  getPublicWarning() {
    return {
      limitName: this.limitName,
    }
  }
}

export class FeatureDisabledWarning extends APIWarning {
  featureName: string
  constructor(featureName: string) {
    super(`Feature disabled: '${featureName}'`, APIWarningCode.FEATURE_DISABLED)
    this.featureName = featureName
    this.status = 400
  }

  getPublicWarning() {
    return {
      featureName: this.featureName,
    }
  }

  getPublicError() {
    return {
      featureName: this.featureName,
    }
  }
}
