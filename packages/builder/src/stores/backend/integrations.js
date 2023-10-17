import { writable } from "svelte/store"
import { API } from "api"

const createIntegrationsStore = () => {
  const store = writable({})

  const init = async () => {
    const integrations = await API.getIntegrations()
    store.set(integrations)
  }

  return {
    ...store,
    init,
  }
}

export const integrations = createIntegrationsStore()
