import { API } from "api"
import { writable } from "svelte/store"

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
