import { PlanType } from "@budibase/types"

export function getFormattedPlanName(userPlanType) {
  let planName
  switch (userPlanType) {
    case PlanType.PRO:
      planName = "Pro"
      break
    case PlanType.TEAM:
      planName = "Team"
      break
    case PlanType.PREMIUM:
    case PlanType.PREMIUM_PLUS:
      planName = "Premium"
      break
    case PlanType.BUSINESS:
      planName = "Business"
      break
    case PlanType.ENTERPRISE_BASIC:
    case PlanType.ENTERPRISE:
      planName = "Enterprise"
      break
    default:
      planName = "Free" // Default to "Free" if the type is not explicitly handled
  }
  return `${planName} Plan`
}

export function isPremiumAndAbove(userPlanType) {
  return ![PlanType.PRO, PlanType.TEAM, PlanType.FREE].includes(userPlanType);
}
