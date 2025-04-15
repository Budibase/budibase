import { API } from "@/api"
import { writable } from "svelte/store"
import type { GetEnvironmentResponse } from "@budibase/types"

interface EnvironmentState extends GetEnvironmentResponse {
  loaded: boolean
}

const initialState: EnvironmentState = {
  multiTenancy: false,
  offlineMode: false,
  cloud: false,
  disableAccountPortal: false,
  isDev: false,
  maintenance: [],
  loaded: false,
}

const createEnvironmentStore = () => {
  const store = writable<EnvironmentState>(initialState)

  const actions = {
    fetchEnvironment: async () => {
      try {
        const environment = await API.getEnvironment()
        store.set({
          ...initialState,
          ...environment,
          loaded: true,
        })
      } catch (error) {
        store.set(initialState)
      }
    },
  }

  return {
    subscribe: store.subscribe,
    actions,
  }
}

export const environmentStore = createEnvironmentStore()
