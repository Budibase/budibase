import { notifications } from "@budibase/bbui"
import { API } from "api"
import { writable } from "svelte/store"

export const createDeploymentStore = () => {
  let store = writable([])

  const load = async () => {
    try {
      store.set(await API.getAppDeployments())
    } catch (_err) {
      notifications.error("Error fetching deployments")
    }
  }

  return {
    subscribe: store.subscribe,
    load,
  }
}

export const deploymentStore = createDeploymentStore()
