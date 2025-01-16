import { FeatureFlag } from "@budibase/types"
import { auth } from "../stores/portal"
import { get } from "svelte/store"

export const isEnabled = (featureFlag: FeatureFlag | `${FeatureFlag}`) => {
  const user = get(auth).user
  return !!user?.flags?.[featureFlag]
}
