import { getTenantId } from "@budibase/backend-core/tenancy"
import { getAllApps } from "@budibase/backend-core/db"
import * as Pro from "@budibase/pro"
import { getUniqueRows } from "../../../utilities/usageQuota/rows"

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
  await Pro.Licensing.Quotas.setUsage(
    rowCount,
    Pro.StaticQuotaName.ROWS,
    Pro.QuotaUsageType.STATIC
  )
}
