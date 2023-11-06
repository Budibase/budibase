import { writable } from "svelte/store"

export const createDatabaseStore = () => {
  const store = writable({})

  const syncAppDatabase = pkg => {
    const { application } = pkg
    store.set({ ...application.instance })
  }

  return {
    subscribe: store.subscribe,
    syncAppDatabase,
  }
}

export const database = createDatabaseStore()
