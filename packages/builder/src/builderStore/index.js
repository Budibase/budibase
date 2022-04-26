import { getFrontendStore } from "./store/frontend"
import { getAutomationStore } from "./store/automation"
import { getThemeStore } from "./store/theme"
import { derived, writable } from "svelte/store"
import { LAYOUT_NAMES } from "../constants"
import { findComponent, findComponentPath } from "./componentUtils"

export const store = getFrontendStore()
export const automationStore = getAutomationStore()
export const themeStore = getThemeStore()

export const selectedScreen = derived(store, $store => {
  return $store.screens.find(screen => screen._id === $store.selectedScreenId)
})

export const selectedComponent = derived(
  [store, selectedScreen],
  ([$store, $selectedScreen]) => {
    if (!$selectedScreen || !$store.selectedComponentId) {
      return null
    }
    return findComponent($selectedScreen?.props, $store.selectedComponentId)
  }
)

export const selectedComponentPath = derived(
  [store, selectedScreen],
  ([$store, $selectedScreen]) => {
    return findComponentPath(
      $selectedScreen?.props,
      $store.selectedComponentId
    ).map(component => component._id)
  }
)

export const mainLayout = derived(store, $store => {
  return $store.layouts?.find(
    layout => layout._id === LAYOUT_NAMES.MASTER.PRIVATE
  )
})

export const selectedAccessRole = writable("BASIC")

// For compatibility
export const currentAsset = selectedScreen
