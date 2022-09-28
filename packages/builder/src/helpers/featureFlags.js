import { auth } from "../stores/portal"
import { get } from "svelte/store"

export const TENANT_FEATURE_FLAGS = {
  LICENSING: "LICENSING",
  USER_GROUPS: "USER_GROUPS",
}

export const isEnabled = featureFlag => {
  const user = get(auth).user
  return !!user?.featureFlags?.includes(featureFlag)
}
