import { writable } from "svelte/store"
import { API } from "api"

const createIntegrationsStore = () => {
  const store = writable(null)

  return {
    ...store,
    init: async () => {
      try {
        const integrations = await API.getIntegrations()
        store.set(integrations)
      } catch (error) {
        store.set(null)
      }
    },
  }
}

export const integrations = createIntegrationsStore()
