import { derived } from "svelte/store"
import { AutomationActionStepId, FeatureFlag } from "@budibase/types"
import { automationStore } from "./automations"
import { admin } from "../portal/admin"
import { featureFlags } from "../portal/featureFlags"

export const functionsAvailable = derived(
  [admin, featureFlags, automationStore],
  ([$admin, $featureFlags, $automationStore]) =>
    !$admin.cloud &&
    !!$featureFlags[FeatureFlag.FUNCTIONS] &&
    !!$automationStore.blockDefinitions.ACTION[
      AutomationActionStepId.EXECUTE_FUNCTION
    ]
)
