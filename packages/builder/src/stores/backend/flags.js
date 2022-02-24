import { writable } from "svelte/store"
import { API } from "api"

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
  }

  return {
    subscribe,
    ...actions,
  }
}

export const flags = createFlagsStore()
