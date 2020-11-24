import { getFrontendStore } from "./store/frontend"
import { getBackendUiStore } from "./store/backend"
import { getAutomationStore } from "./store/automation/"
import { getThemeStore } from "./store/theme"
import { derived } from "svelte/store"
import analytics from "analytics"

export const store = getFrontendStore()
export const backendUiStore = getBackendUiStore()
export const automationStore = getAutomationStore()
export const themeStore = getThemeStore()

export const currentAsset = derived(store, $store => {
  const layout = $store.layouts ? $store.layouts.find(layout => layout._id === $store.currentAssetId) : null
  if (layout) {
    return layout
  }
  const screen = $store.screens ? $store.screens.find(screen => screen._id === $store.currentAssetId) : null
  if (screen) {
    return screen
  }
  return null
})

export const currentAssetName = derived(store, () => {
  return currentAsset.name
})

// leave this as before for consistency
export const allScreens = derived(store, $store => {
  return $store.screens
})

export const currentScreens = derived(store, $store => {
  const currentScreens = $store.layouts[currentAssetName]?._screens
  if (currentScreens == null) {
    return []
  }
  return Array.isArray(currentScreens)
    ? currentScreens
    : Object.values(currentScreens)
})

export const initialise = async () => {
  try {
    await analytics.activate()
    analytics.captureEvent("Builder Started")
  } catch (err) {
    console.log(err)
  }
}
