import { writable, get, derived } from "svelte/store"
import { createLocalStorageStore } from "@budibase/frontend-core"

const createStateStore = () => {
  const appId = window["##BUDIBASE_APP_ID##"] || "app"
  const localStorageKey = `${appId}.state`
  const persistentStore = createLocalStorageStore(localStorageKey, {})

  // Initialise the temp store to mirror the persistent store
  const tempStore = writable(get(persistentStore))

  // Sets a value to state, optionally persistent
  const setValue = (key, value, persist = false) => {
    const storeToSave = persist ? persistentStore : tempStore
    const storeToClear = persist ? tempStore : persistentStore
    storeToSave.update(state => {
      state[key] = value
      return state
    })
    storeToClear.update(state => {
      delete state[key]
      return state
    })
  }

  // Delete a certain key from both stores
  const deleteValue = key => {
    const stores = [tempStore, persistentStore]
    stores.forEach(store => {
      store.update(state => {
        delete state[key]
        return state
      })
    })
  }

  // Initialises the temporary state store with a certain value
  const initialise = tempStore.set

  // Derive the combination of both persisted and non persisted stores
  const store = derived(
    [tempStore, persistentStore],
    ([$tempStore, $persistentStore]) => {
      return {
        ...$tempStore,
        ...$persistentStore,
      }
    }
  )

  return {
    subscribe: store.subscribe,
    actions: { setValue, deleteValue, initialise },
  }
}

export const stateStore = createStateStore()
