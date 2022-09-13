import { createLocalStorageStore } from "@budibase/frontend-core"
import { get } from "svelte/store"

export const getTemporalStore = () => {
  const initialValue = {}

  //const appId = window["##BUDIBASE_APP_ID##"] || "app"
  const localStorageKey = `${123}.bb-temporal`
  const store = createLocalStorageStore(localStorageKey, initialValue)

  const setExpiring = (key, data, duration) => {
    const updated = {
      ...data,
      expiry: Date.now() + duration * 1000,
    }

    store.update(state => ({
      ...state,
      [key]: updated,
    }))
  }

  const getExpiring = key => {
    const entry = get(store)[key]
    if (!entry) {
      return
    }
    const currentExpiry = entry.expiry
    if (currentExpiry < Date.now()) {
      store.update(state => {
        delete state[key]
        return state
      })
      return null
    } else {
      return entry
    }
  }

  return {
    subscribe: store.subscribe,
    actions: { setExpiring, getExpiring },
  }
}
