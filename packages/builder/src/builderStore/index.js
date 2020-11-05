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

export const allScreens = derived(store, $store => {
  let screens = []
  if ($store.pages == null) {
    return screens
  }
  for (let page of Object.values($store.pages)) {
    screens = screens.concat(page._screens)
  }
  return screens
})

export const currentScreens = derived(store, $store => {
  const currentScreens = $store.pages[$store.currentPageName]?._screens
  if (currentScreens == null) {
    return []
  }
  return Array.isArray(currentScreens) ? currentScreens : Object.values(currentScreens)
})

export const initialise = async () => {
  try {
    await analytics.activate()
    analytics.captureEvent("Builder Started")
  } catch (err) {
    console.log(err)
  }
}
