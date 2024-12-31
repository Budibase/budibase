import { writable, type Writable } from "svelte/store"
import { API } from "@/api"
import { Integration } from "@budibase/types"

type IntegrationsState = Record<string, Integration>

const INITIAL_STATE: IntegrationsState = {}

const createIntegrationsStore = () => {
  const store: Writable<IntegrationsState> = writable(INITIAL_STATE)

  const init = async () => {
    const response = await API.getIntegrations()

    // Filter out undefineds
    const integrations = Object.entries(response).reduce(
      (acc, [key, value]) => {
        if (value) {
          acc[key] = value
        }
        return acc
      },
      {} as IntegrationsState
    )
    store.set(integrations)
  }

  return {
    ...store,
    init,
  }
}

export const integrations = createIntegrationsStore()
