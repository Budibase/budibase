import { API } from "api"
import { writable } from "svelte/store"

export function createFlagsStore() {
  const { subscribe, set } = writable({})

  const actions = {
    fetch: async () => {
      const flags = await API.getFlags()
      set(flags)
    },
    updateFlag: async (flag, value) => {
      await API.updateFlag({
        flag,
        value,
      })
      await actions.fetch()
    },
    toggleUiFeature: async feature => {
      await API.toggleUiFeature({ value: feature })
    },
  }

  return {
    subscribe,
    ...actions,
  }
}

export const flags = createFlagsStore()
