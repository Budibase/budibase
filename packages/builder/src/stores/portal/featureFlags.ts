import type { Readable } from "svelte/store"
import { derived } from "svelte/store"
import { auth } from "@/stores/portal"
import type { FeatureFlags } from "@budibase/types"
import { FeatureFlagDefaults } from "@budibase/types"

export const featureFlags: Readable<FeatureFlags> = derived(auth, $auth => ({
  ...FeatureFlagDefaults,
  ...($auth?.user?.flags || {}),
}))
