import { getFrontendStore } from "./store/frontend"
import { getAutomationStore } from "./store/automation"
import { getThemeStore } from "./store/theme"
import { derived, writable } from "svelte/store"
import { FrontendTypes, LAYOUT_NAMES } from "../constants"
import { findComponent, findComponentPath } from "./componentUtils"

export const store = getFrontendStore()
export const automationStore = getAutomationStore()
export const themeStore = getThemeStore()

export const currentAsset = derived(store, $store => {
  const type = $store.currentFrontEndType
  if (type === FrontendTypes.SCREEN) {
    return $store.screens.find(screen => screen._id === $store.selectedScreenId)
  } else if (type === FrontendTypes.LAYOUT) {
    return $store.layouts.find(layout => layout._id === $store.selectedLayoutId)
  }
  return null
})

export const selectedComponent = derived(
  [store, currentAsset],
  ([$store, $currentAsset]) => {
    if (!$currentAsset || !$store.selectedComponentId) {
      return null
    }
    return findComponent($currentAsset?.props, $store.selectedComponentId)
  }
)

export const selectedComponentPath = derived(
  [store, currentAsset],
  ([$store, $currentAsset]) => {
    return findComponentPath(
      $currentAsset?.props,
      $store.selectedComponentId
    ).map(component => component._id)
  }
)

export const currentAssetId = derived(store, $store => {
  return $store.currentFrontEndType === FrontendTypes.SCREEN
    ? $store.selectedScreenId
    : $store.selectedLayoutId
})

export const currentAssetName = derived(currentAsset, $currentAsset => {
  return $currentAsset?.name
})

// leave this as before for consistency
export const allScreens = derived(store, $store => {
  return $store.screens
})

export const mainLayout = derived(store, $store => {
  return $store.layouts?.find(
    layout => layout._id === LAYOUT_NAMES.MASTER.PRIVATE
  )
})

export const selectedAccessRole = writable("BASIC")

export const screenSearchString = writable(null)
