import { auth } from "../stores/portal"
import { get } from "svelte/store"

export const isEnabled = featureFlag => {
  const user = get(auth).user
  return !!user?.flags?.[featureFlag]
}
