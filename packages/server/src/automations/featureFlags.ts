import { context, features } from "@budibase/backend-core"
import { FeatureFlag } from "@budibase/types"

export const getAutomationFeatureFlagOverrides = async () => {
  try {
    if (!(await features.isEnabledWithoutOverrides(FeatureFlag.DEBUG_UI))) {
      return {}
    }

    return { ...context.getFeatureFlagOverrides() }
  } catch (err) {
    console.warn("Unable to resolve automation feature flag overrides", err)
    return {}
  }
}
