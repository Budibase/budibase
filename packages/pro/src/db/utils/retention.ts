import { ConstantQuotaName, QuotaType } from "@budibase/types"
import * as licensing from "../../sdk/licensing"
import { licenses } from "../../constants"

const MIN_DATE = new Date(0).toISOString()
const ONE_DAY_MILLIS = 1000 * 60 * 60 * 24

export async function getOldestRetentionDate(quotaName: ConstantQuotaName) {
  const license = await licensing.cache.getCachedLicense()
  const retentionDays = license.quotas?.[QuotaType.CONSTANT]?.[quotaName]?.value
  if (
    retentionDays === licenses.UNLIMITED ||
    retentionDays == null ||
    !Number.isFinite(retentionDays) ||
    retentionDays <= 0
  ) {
    return MIN_DATE
  } else {
    return new Date(
      new Date().getTime() - ONE_DAY_MILLIS * retentionDays
    ).toISOString()
  }
}
