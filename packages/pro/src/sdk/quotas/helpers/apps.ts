import { db } from "@budibase/backend-core"
import { QuotaUsageType, StaticQuotaName } from "@budibase/types"
import * as quotas from "./../quotas"

interface AppOpts {
  appId?: string
}

// DEV

const getDevAppsCount = async () => {
  const workspaces = await db.getAllWorkspaces({ dev: true })
  return workspaces ? workspaces.length : 0
}

export const addApp = async (addAppFn: any, { appId }: AppOpts = {}) => {
  return quotas.increment(StaticQuotaName.WORKSPACES, QuotaUsageType.STATIC, {
    fn: addAppFn,
    valueFn: getDevAppsCount,
    id: appId,
  })
}

export const removeApp = async ({ appId }: AppOpts = {}) => {
  return quotas.decrement(StaticQuotaName.WORKSPACES, QuotaUsageType.STATIC, {
    valueFn: getDevAppsCount,
    id: appId,
  })
}
