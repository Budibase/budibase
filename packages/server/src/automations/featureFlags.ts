import { context, features } from "@budibase/backend-core"
import { FeatureFlag } from "@budibase/types"

export const getAutomationFeatureFlagOverrides = async () => {
  if (!(await features.isEnabledWithoutOverrides(FeatureFlag.DEBUG_UI))) {
    return {}
  }

  return { ...context.getFeatureFlagOverrides() }
}
