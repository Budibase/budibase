import { writable } from "svelte/store"
import { API } from "api"

const createIntegrationsStore = () => {
  const store = writable(null)

  return {
    ...store,
    init: async () => {
      const integrations = await API.getIntegrations()
      store.set(integrations)
    },
  }
}

export const integrations = createIntegrationsStore()
