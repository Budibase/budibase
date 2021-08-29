import { getFrontendStore } from "./store/frontend"
import { getAutomationStore } from "./store/automation"
import { getHostingStore } from "./store/hosting"
import { getThemeStore } from "./store/theme"
import { getLocaleStore } from "./store/i18n"
import { derived, writable } from "svelte/store"
import analytics from "analytics"
import { FrontendTypes, LAYOUT_NAMES } from "../constants"
import { findComponent } from "./storeUtils"

export const store = getFrontendStore()
export const automationStore = getAutomationStore()
export const themeStore = getThemeStore()
export const localeStore = getLocaleStore()
export const hostingStore = getHostingStore()

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
    return findComponent($currentAsset.props, $store.selectedComponentId)
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

export const initialise = async () => {
  try {
    await analytics.activate()
    analytics.captureEvent("Builder Started")
  } catch (err) {
    console.log(err)
  }
}

export const screenSearchString = writable(null)
