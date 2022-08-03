import { auth } from "../stores/portal"
import { get } from "svelte/store"

export const FEATURE_FLAGS = {
  LICENSING: "LICENSING",
  USER_GROUPS: "USER_GROUPS",
}

export const isEnabled = featureFlag => {
  const user = get(auth).user
  if (user?.featureFlags?.includes(featureFlag)) {
    return true
  }
  return false
}
