import { get } from "svelte/store"
import { auth } from "../stores/portal"

export const TENANT_FEATURE_FLAGS = {
  LICENSING: "LICENSING",
  USER_GROUPS: "USER_GROUPS",
  ONBOARDING_TOUR: "ONBOARDING_TOUR",
}

export const isEnabled = featureFlag => {
  const user = get(auth).user
  return !!user?.featureFlags?.includes(featureFlag)
}
