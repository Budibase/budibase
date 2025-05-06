import { derived } from "svelte/store"
import { screenStore, selectedScreen } from "./screens"

export const selectedProjectAppId = derived(
  [selectedScreen, screenStore],
  ([$selectedScreen, $screenStore]) => {
    if ($selectedScreen) {
      return $selectedScreen.projectAppId
    }

    return $screenStore.screens[0].projectAppId
  }
)
