import { writable } from "svelte/store"

export const getUsersStore = () => {
  const initialValue = {
    users: [],
  }
  const store = writable(initialValue)

  return store
}
