import { authStore } from "../stores/auth.js"
import { get } from "svelte/store"
import { PlanType } from "./constants"

const getLicense = () => {
  const user = get(authStore)
  if (user) {
    return user.license
  }
}

export const isFreePlan = () => {
  const license = getLicense()
  if (license) {
    return license.plan.type === PlanType.FREE
  } else {
    // safety net - no license means free plan
    return true
  }
}
