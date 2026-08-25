import { context, features } from "@budibase/backend-core"
import { FeatureFlag } from "@budibase/types"

const AUTOMATION_OVERRIDE_ALLOWLIST = [
  FeatureFlag.AI_TOOL_ESCALATION,
  FeatureFlag.AI_AGENT_TOOL_SECURITY,
] as const

export const getAutomationFeatureFlagOverrides = async () => {
  if (!(await features.isEnabledWithoutOverrides(FeatureFlag.DEBUG_UI))) {
    return {}
  }

  const overrides = context.getFeatureFlagOverrides()
  return Object.fromEntries(
    AUTOMATION_OVERRIDE_ALLOWLIST.flatMap(flag =>
      typeof overrides[flag] === "boolean" ? [[flag, overrides[flag]]] : []
    )
  )
}
