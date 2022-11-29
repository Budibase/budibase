import { AccountPlan, License, PlanType, Quotas } from "@budibase/types"

const newPlan = (type: PlanType = PlanType.FREE): AccountPlan => {
  return {
    type,
  }
}

export const newLicense = (opts: {
  quotas: Quotas
  planType?: PlanType
}): License => {
  return {
    features: [],
    quotas: opts.quotas,
    plan: newPlan(opts.planType),
  }
}
