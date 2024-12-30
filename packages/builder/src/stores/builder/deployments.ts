import { writable, type Writable } from "svelte/store"
import { API } from "@/api"
import { notifications } from "@budibase/bbui"
import { DeploymentProgressResponse } from "@budibase/types"

export const createDeploymentStore = () => {
  let store: Writable<DeploymentProgressResponse[]> = writable([])

  const load = async (): Promise<void> => {
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
