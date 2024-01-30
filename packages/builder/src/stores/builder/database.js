import { writable } from "svelte/store"

export const createDatabaseStore = () => {
  const store = writable({})

  const syncAppDatabase = application => {
    store.set({ ...application.instance })
  }

  return {
    subscribe: store.subscribe,
    syncAppDatabase,
  }
}

export const database = createDatabaseStore()
