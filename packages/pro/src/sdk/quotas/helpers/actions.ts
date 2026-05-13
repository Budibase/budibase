import { ActionType, MonthlyQuotaName, QuotaUsageType } from "@budibase/types"
import * as quotas from "./../quotas"

export const addAction = async <T>(
  actionType: ActionType,
  addActionFn: () => Promise<T>
) => {
  return quotas.increment(MonthlyQuotaName.ACTIONS, QuotaUsageType.MONTHLY, {
    fn: addActionFn,
    id: actionType,
  })
}
