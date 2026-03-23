import { HTTPError } from "@budibase/backend-core"
import { APIWarningCode, MonthlyQuotaName } from "@budibase/types"

export class GroupNameUnavailableError extends HTTPError {
  constructor(groupName: string) {
    super(`Group name "${groupName}" is unavailable`, 409)
  }
}

export class AICreditsExhaustedError extends HTTPError {
  constructor() {
    super(
      "You have reached your Budibase AI Credits limit for this billing cycle.",
      402
    )
    this.code = APIWarningCode.USAGE_LIMIT_EXCEEDED
  }

  getPublicError() {
    return { quota: MonthlyQuotaName.BUDIBASE_AI_CREDITS }
  }
}
