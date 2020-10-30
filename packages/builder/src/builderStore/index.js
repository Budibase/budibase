import { getStore } from "./store"
import { getBackendUiStore } from "./store/backend"
import { getAutomationStore } from "./store/automation/"
import { getThemeStore } from "./store/theme"
import analytics from "analytics"

export const store = getStore()
export const backendUiStore = getBackendUiStore()
export const automationStore = getAutomationStore()
export const themeStore = getThemeStore()

export const initialise = async () => {
  try {
    await analytics.activate()
    analytics.captureEvent("Builder Started")
  } catch (err) {
    console.log(err)
  }
}
