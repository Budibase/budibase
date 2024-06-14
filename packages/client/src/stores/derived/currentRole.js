import { derived } from "svelte/store"
import { devToolsStore } from "../devTools.js"
import { authStore } from "../auth.js"
import { devToolsEnabled } from "./devToolsEnabled.js"
import { BuiltInRole } from "@budibase/types"

// Derive the current role of the logged-in user
export const currentRole = derived(
  [devToolsEnabled, devToolsStore, authStore],
  ([$devToolsEnabled, $devToolsStore, $authStore]) => {
    return (
      ($devToolsEnabled && $devToolsStore.role) ||
      $authStore?.roleId ||
      BuiltInRole.PUBLIC
    )
  }
)
