import { writable } from "svelte/store"

const INITIAL_ADMIN_STATE = {
  oauth: [],
}

export const admin = writable({ ...INITIAL_ADMIN_STATE })
