import { derived } from "svelte/store"
import { auth } from "stores/portal"

export const INITIAL_FEATUREFLAG_STATE = {
  SQS: false,
  DEFAULT_VALUES: false,
  BUDIBASE_AI: false,
  AI_CUSTOM_CONFIGS: false,
}

export const featureFlags = derived([auth], ([$auth]) => {
  return {
    ...INITIAL_FEATUREFLAG_STATE,
    ...($auth?.user?.flags || {}),
  }
})
