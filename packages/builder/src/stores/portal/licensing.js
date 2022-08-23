import { writable } from "svelte/store"
import { API } from "api"

export const createLicensingStore = () => {
  const DEFAULT = {
    plans: {},
  }

  const store = writable(DEFAULT)

  const actions = {
    getQuotaUsage: async () => {
      const quotaUsage = await API.getQuotaUsage()
      store.update(state => {
        return {
          ...state,
          quotaUsage,
        }
      })
    },
  }

  return {
    subscribe: store.subscribe,
    ...actions,
  }
}

export const licensing = createLicensingStore()
