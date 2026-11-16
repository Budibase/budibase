import { constants as proConstants, licensing } from "@budibase/pro"
import type {
  PlatformActionSessionStatus,
  PlatformActionSessionIndexDoc,
} from "@budibase/types"
import { ConstantQuotaName } from "@budibase/types"

const ONE_DAY_MILLIS = 1000 * 60 * 60 * 24

export const EXPIRABLE_STATUSES: readonly PlatformActionSessionStatus[] = [
  "completed",
  "failed",
]

// Undefined means nothing expires. A missing quota is expected for licenses
// issued before the quota existed.
export async function getRetentionDays(): Promise<number | undefined> {
  const license = await licensing.cache.getCachedLicense()
  const retentionDays =
    license.quotas?.constant?.[
      ConstantQuotaName.PLATFORM_ACTIONS_RETENTION_DAYS
    ]?.value

  if (
    retentionDays == null ||
    retentionDays === proConstants.licenses.UNLIMITED
  ) {
    return undefined
  }
  if (!Number.isInteger(retentionDays) || retentionDays < 1) {
    throw new Error(
      `Invalid platform actions retention quota: ${retentionDays} days`
    )
  }

  return retentionDays
}

export async function getRetentionCutoff(): Promise<string | undefined> {
  const retentionDays = await getRetentionDays()
  return retentionDays === undefined
    ? undefined
    : new Date(Date.now() - ONE_DAY_MILLIS * retentionDays).toISOString()
}

export function isExpiredSession({
  session,
  cutoff,
}: {
  session: Pick<PlatformActionSessionIndexDoc, "status" | "updatedAt">
  cutoff: string | undefined
}): boolean {
  return (
    cutoff !== undefined &&
    EXPIRABLE_STATUSES.includes(session.status) &&
    session.updatedAt < cutoff
  )
}
