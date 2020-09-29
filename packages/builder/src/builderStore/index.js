import { getStore } from "./store"
import { getBackendUiStore } from "./store/backend"
import { getAutomationStore } from "./store/automation/"
import analytics from "analytics"

export const store = getStore()
export const backendUiStore = getBackendUiStore()
export const automationStore = getAutomationStore()

export const initialise = async () => {
  try {
    analytics.activate()
    analytics.captureEvent("Builder Started")
  } catch (err) {
    console.log(err)
  }
}
