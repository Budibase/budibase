import { writable } from "svelte/store"

const INITIAL_ADMIN_STATE = {
  oauth: [],
}

export const getAdminStore = () => {
  const store = writable({ ...INITIAL_ADMIN_STATE })
  store.actions = {}
  return store
}
