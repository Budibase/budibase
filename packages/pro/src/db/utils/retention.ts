import { ConstantQuotaName, QuotaType } from "@budibase/types"
import * as licensing from "../../sdk/licensing"
import { licenses } from "../../constants"

const MAX_DATE = new Date(8640000000000000).toISOString()
const ONE_DAY_MILLIS = 1000 * 60 * 60 * 24

export async function getOldestRetentionDate(quotaName: ConstantQuotaName) {
  const license = await licensing.cache.getCachedLicense()
  const retentionDays =
    license.quotas?.[QuotaType.CONSTANT]?.[quotaName]?.value || 0
  if (retentionDays === licenses.UNLIMITED) {
    return new Date(MAX_DATE).toISOString()
  } else {
    return new Date(
      new Date().getTime() - ONE_DAY_MILLIS * retentionDays
    ).toISOString()
  }
}
