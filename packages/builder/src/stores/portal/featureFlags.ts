import { derived, Readable } from "svelte/store"
import { auth } from "@/stores/portal"
import { FeatureFlags, FeatureFlagDefaults } from "@budibase/types"

export const featureFlags: Readable<FeatureFlags> = derived(
  [auth],
  ([$auth]) => {
    return {
      ...FeatureFlagDefaults,
      ...($auth?.user?.flags || {}),
    }
  }
)
