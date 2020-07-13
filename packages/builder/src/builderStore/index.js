import { getStore } from "./store"
import { getBackendUiStore } from "./store/backend"
import { getWorkflowStore } from "./store/workflow/"
import posthog from "posthog-js";

export const store = getStore()
export const backendUiStore = getBackendUiStore()
export const workflowStore = getWorkflowStore()

export const initialise = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      posthog.init(process.env.POSTHOG_TOKEN, { api_host: process.env.POSTHOG_URL });
    }
  } catch (err) {
    console.log(err)
  }
}
