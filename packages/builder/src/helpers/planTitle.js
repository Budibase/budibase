import { PlanType } from "@budibase/types"
  
export function getFormattedPlanName(userPlanType) {
  let planName = "Free";
  if (userPlanType === PlanType.PREMIUM_PLUS) {
    planName = "Premium";
  } else if (userPlanType === PlanType.ENTERPRISE_BASIC) {
    planName = "Enterprise";
  }
  return `${planName} Plan`;
}