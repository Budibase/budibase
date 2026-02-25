import * as quotas from "./../quotas"
import { QuotaUsageType, MonthlyQuotaName } from "@budibase/types"

type AutomationOpts = {
  automationId?: string
}

export const addAutomation = async (
  runAutomationFn: any,
  { automationId }: AutomationOpts = {}
) => {
  return quotas.increment(
    MonthlyQuotaName.AUTOMATIONS,
    QuotaUsageType.MONTHLY,
    { fn: runAutomationFn, id: automationId }
  )
}
