import { getStore } from "./store"
import { getBackendUiStore } from "./store/backend"
import { getWorkflowStore } from "./store/workflow/"
import analytics from "../analytics"

export const store = getStore()
export const backendUiStore = getBackendUiStore()
export const workflowStore = getWorkflowStore()

export const initialise = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      analytics.activate()
    }
  } catch (err) {
    console.log(err)
  }
}
