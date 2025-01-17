import { PlanType } from "@budibase/types"

export function getFormattedPlanName(userPlanType: PlanType) {
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
    case PlanType.ENTERPRISE_BASIC_TRIAL:
      planName = "Trial"
      break
    default:
      planName = "Free" // Default to "Free" if the type is not explicitly handled
  }
  return `${planName} Plan`
}

export function isPremiumOrAbove(userPlanType: PlanType) {
  return ![PlanType.PRO, PlanType.TEAM, PlanType.FREE].includes(userPlanType)
}
