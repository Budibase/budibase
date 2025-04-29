import { auth } from "@/stores/portal"
import { FeatureFlag, FeatureFlags, FeatureFlagDefaults } from "@budibase/types"
import { BudiStore } from "@/stores/BudiStore"
import { API } from "@/api"
import { notifications } from "@budibase/bbui"

class FeatureFlagStore extends BudiStore<FeatureFlags> {
  constructor() {
    super(FeatureFlagDefaults)
    auth.subscribe($auth => {
      this.set({
        ...FeatureFlagDefaults,
        ...($auth?.user?.flags || {}),
      })
    })
  }

  async setFlag(flag: FeatureFlag, value: boolean) {
    try {
      await API.overrideFeatureFlags({
        [flag]: value,
      })
      // The feature flag store is derived from the auth store, so we need to
      // refresh the auth store to update the feature flags.
      await auth.getSelf()
      notifications.success(
        `Feature flag ${flag} ${value ? "enabled" : "disabled"}`
      )
    } catch (e) {
      console.error(e)
      notifications.error(
        `Failed to set feature flag ${flag} to ${value}, see console for details`
      )
    }
  }
}

export const featureFlags = new FeatureFlagStore()
