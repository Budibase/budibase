import { derived } from "svelte/store"
import { Constants } from "@budibase/frontend-core"
import { devToolsStore } from "../devTools.js"
import { authStore } from "../auth.js"

// Derive the current role of the logged-in user
export const currentRole = derived(
  [devToolsStore, authStore],
  ([$devToolsStore, $authStore]) => {
    return (
      ($devToolsStore.enabled && $devToolsStore.role) ||
      $authStore?.roleId ||
      Constants.Roles.PUBLIC
    )
  }
)
