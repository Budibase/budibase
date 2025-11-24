// BASE

import { APIWarningCode } from "@budibase/types"

export abstract class APIWarning extends Error {
  code: string

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

  constructor(message: string, limitName: string) {
    super(message, APIWarningCode.USAGE_LIMIT_EXCEEDED)
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

  constructor(message: string, featureName: string) {
    super(message, APIWarningCode.FEATURE_DISABLED)
    this.featureName = featureName
  }

  getPublicWarning() {
    return {
      featureName: this.featureName,
    }
  }
}
