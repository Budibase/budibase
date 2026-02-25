import * as quotas from "./../quotas"
import {
  APIWarningCode,
  MonthlyQuotaName,
  QuotaType,
  QuotaUsageType,
} from "@budibase/types"
import { AICreditsExhaustedError } from "../../../errors"

// BUDIBASE AI
export const incrementBudibaseAICredits = async (count: number) => {
  try {
    return await quotas.incrementMany({
      change: count,
      name: MonthlyQuotaName.BUDIBASE_AI_CREDITS,
      type: QuotaUsageType.MONTHLY,
    })
  } catch (e: any) {
    if (e.code === APIWarningCode.USAGE_LIMIT_EXCEEDED) {
      // tryIncrement does a dry-run before saving, so when it throws the counter
      // is never updated. Cap it at the quota limit so the next pre-flight
      // throwIfBudibaseAICreditsExceeded() call (usageChange: 1) sees
      // limit + 1 > limit = true and correctly blocks the request.
      await capBudibaseAICreditsAtLimit().catch(() => {})
    }
    throw e
  }
}

const capBudibaseAICreditsAtLimit = async () => {
  const licensedQuota = await quotas.getLicensedQuota(
    QuotaType.USAGE,
    MonthlyQuotaName.BUDIBASE_AI_CREDITS,
    QuotaUsageType.MONTHLY
  )
  // value === -1 means UNLIMITED, nothing to cap
  if (licensedQuota.value >= 0) {
    await setBudibaseAICredits(licensedQuota.value)
  }
}

export const throwIfBudibaseAICreditsExceeded = async () => {
  const exceeded = await quotas.usageLimitIsExceeded({
    name: MonthlyQuotaName.BUDIBASE_AI_CREDITS,
    type: QuotaUsageType.MONTHLY,
    usageChange: 1,
  })
  if (exceeded) {
    throw new AICreditsExhaustedError()
  }
}

export const setBudibaseAICredits = async (count: number) => {
  return quotas.set(
    MonthlyQuotaName.BUDIBASE_AI_CREDITS,
    QuotaUsageType.MONTHLY,
    count
  )
}
