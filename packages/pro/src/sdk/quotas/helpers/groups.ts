import * as quotas from "./../quotas"
import { QuotaUsageType, StaticQuotaName } from "@budibase/types"

export const addGroup = async <T>(addGroupFn: () => Promise<T>): Promise<T> => {
  return quotas.increment(StaticQuotaName.USER_GROUPS, QuotaUsageType.STATIC, {
    fn: addGroupFn,
  })
}

export const removeGroup = async () => {
  return quotas.decrement(StaticQuotaName.USER_GROUPS, QuotaUsageType.STATIC)
}
