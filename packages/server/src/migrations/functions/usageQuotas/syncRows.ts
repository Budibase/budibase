import { getTenantId } from "@budibase/backend-core/tenancy"
import { getAllApps } from "@budibase/backend-core/db"
import { getUniqueRows } from "../../../utilities/usageQuota/rows"
import { quotas } from "@budibase/pro"
import { QuotaUsageType, StaticQuotaName } from "@budibase/types"

export const run = async () => {
  // get all rows in all apps
  // @ts-ignore
  const allApps = await getAllApps({ all: true })
  // @ts-ignore
  const appIds = allApps ? allApps.map((app: { appId: any }) => app.appId) : []
  const rows = await getUniqueRows(appIds)
  const rowCount = rows ? rows.length : 0

  // sync row count
  const tenantId = getTenantId()
  console.log(`[Tenant: ${tenantId}] Syncing row count: ${rowCount}`)
  await quotas.setUsage(rowCount, StaticQuotaName.ROWS, QuotaUsageType.STATIC)
}
