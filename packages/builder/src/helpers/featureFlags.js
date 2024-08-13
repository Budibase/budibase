import { auth } from "../stores/portal"
import { get } from "svelte/store"

export const TENANT_FEATURE_FLAGS = {
  LICENSING: "LICENSING",
  USER_GROUPS: "USER_GROUPS",
  ONBOARDING_TOUR: "ONBOARDING_TOUR",
  GOOGLE_SHEETS: "GOOGLE_SHEETS",
  DEFAULT_VALUES: "DEFAULT_VALUES",
}

export const isEnabled = featureFlag => {
  const user = get(auth).user
  return !!user?.flags?.[featureFlag]
}
