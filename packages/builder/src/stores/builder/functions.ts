import { derived, writable, type Readable } from "svelte/store"
import { FeatureFlag } from "@budibase/types"
import { admin, featureFlags } from "@/stores/portal"
import { resolveFunctionsGate, RunnerHealth } from "@/helpers/functionsGate"

export interface FunctionsServerState {
  // Server-authoritative flag for whether Functions are enabled in this
  // environment. `undefined` until the server has responded.
  enabled?: boolean
  runnerHealth: RunnerHealth
}

const initialState: FunctionsServerState = {
  enabled: undefined,
  runnerHealth: RunnerHealth.Disabled,
}

// Populated by the API layer from server responses; the server is the authority
// for both availability and runner health.
export const functionsServerState =
  writable<FunctionsServerState>(initialState)

// Whether Functions navigation and the Run Function action should be shown.
export const functionsEnabled: Readable<boolean> = derived(
  [featureFlags, admin, functionsServerState],
  ([$featureFlags, $admin, $server]) =>
    resolveFunctionsGate({
      flagEnabled: !!$featureFlags?.[FeatureFlag.FUNCTIONS],
      cloud: !!$admin?.cloud,
      serverEnabled: $server.enabled,
    })
)

export const runnerHealth: Readable<RunnerHealth> = derived(
  functionsServerState,
  $server => $server.runnerHealth
)
