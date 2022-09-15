import { API } from "api"
import { writable } from "svelte/store"

const initialState = {
  cloud: false,
}

const createEnvironmentStore = () => {
  const store = writable(initialState)

  const actions = {
    fetchEnvironment: async () => {
      try {
        const environment = await API.getEnvironment()
        store.set({
          ...initialState,
          ...environment,
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
