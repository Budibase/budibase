import { License, PlanModel, PlanType, PurchasedPlan, Quotas } from "@budibase/types"

const newPlan = (type: PlanType = PlanType.FREE): PurchasedPlan => {
  return {
    type,
    model: PlanModel.PER_USER,
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
