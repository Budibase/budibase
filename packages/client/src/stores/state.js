import { writable, get, derived } from "svelte/store"
import { localStorageStore } from "builder/src/builderStore/store/localStorage"
import { appStore } from "./app"

const createStateStore = () => {
  const localStorageKey = `${get(appStore).appId}.state`
  const persistentStore = localStorageStore(localStorageKey, {})

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
    actions: { setValue, deleteValue },
  }
}

export const stateStore = createStateStore()
