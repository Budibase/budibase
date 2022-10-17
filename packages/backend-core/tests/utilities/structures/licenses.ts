import { AccountPlan, License, PlanType, Quotas } from "@budibase/types"

const newPlan = (type: PlanType = PlanType.FREE): AccountPlan => {
  return {
    type,
  }
}

export const newLicense = (opts: {
  quotas: Quotas
  plan?: AccountPlan
}): License => {
  return {
    features: [],
    quotas: opts.quotas,
    plan: opts.plan ? opts.plan : newPlan(),
  }
}
