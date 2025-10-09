import { API } from "@/api"
import { BudiStore } from "@/stores/BudiStore"
import { auth } from "@/stores/portal"
import { notifications } from "@budibase/bbui"
import { FeatureFlag, FeatureFlags } from "@budibase/types"

class FeatureFlagStore extends BudiStore<Partial<FeatureFlags>> {
  constructor() {
    super({})
    auth.subscribe($auth => {
      this.set({
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
