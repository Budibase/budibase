import { writable } from "svelte/store"
import { API } from "api"
import { notifications } from "@budibase/bbui"

export const createDeploymentStore = () => {
  let store = writable([])

  const load = async () => {
    try {
      store.set(await API.getAppDeployments())
    } catch (err) {
      notifications.error("Error fetching deployments")
    }
  }

  return {
    subscribe: store.subscribe,
    load,
  }
}

export const deploymentStore = createDeploymentStore()
