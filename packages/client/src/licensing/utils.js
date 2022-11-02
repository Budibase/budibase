import { authStore } from "../stores/auth.js"
import { get } from "svelte/store"
import { Constants } from "@budibase/frontend-core"

const getLicense = () => {
  const user = get(authStore)
  if (user) {
    return user.license
  }
}

export const isFreePlan = () => {
  const license = getLicense()
  if (license) {
    return license.plan.type === Constants.PlanType.FREE
  } else {
    // safety net - no license means free plan
    return true
  }
}
