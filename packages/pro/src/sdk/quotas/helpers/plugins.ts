import * as quotas from "./../quotas"
import { QuotaUsageType, StaticQuotaName } from "@budibase/types"

export const addPlugin = async <T>(addPluginFn: () => Promise<T>) => {
  return quotas.increment<T>(StaticQuotaName.PLUGINS, QuotaUsageType.STATIC, {
    fn: addPluginFn,
  })
}

export const removePlugin = async () => {
  return quotas.decrement(StaticQuotaName.PLUGINS, QuotaUsageType.STATIC)
}

export const updatePluginCount = async (count: number) => {
  return quotas.set(StaticQuotaName.PLUGINS, QuotaUsageType.STATIC, count)
}
