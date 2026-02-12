import * as quotas from "./../quotas"
import { MonthlyQuotaName, QuotaUsageType } from "@budibase/types"

// BUDIBASE AI
export const incrementBudibaseAICredits = async (count: number) => {
  return quotas.incrementMany({
    change: count,
    name: MonthlyQuotaName.BUDIBASE_AI_CREDITS,
    type: QuotaUsageType.MONTHLY,
  })
}

export const setBudibaseAICredits = async (count: number) => {
  return quotas.set(
    MonthlyQuotaName.BUDIBASE_AI_CREDITS,
    QuotaUsageType.MONTHLY,
    count
  )
}
