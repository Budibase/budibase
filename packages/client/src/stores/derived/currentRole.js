import { Constants } from "@budibase/frontend-core"
import { derived } from "svelte/store"
import { authStore } from "../auth.js"
import { devToolsStore } from "../devTools.js"
import { devToolsEnabled } from "./devToolsEnabled.js"

// Derive the current role of the logged-in user
export const currentRole = derived(
  [devToolsEnabled, devToolsStore, authStore],
  ([$devToolsEnabled, $devToolsStore, $authStore]) => {
    return (
      ($devToolsEnabled && $devToolsStore.role) ||
      $authStore?.roleId ||
      Constants.Roles.PUBLIC
    )
  }
)
