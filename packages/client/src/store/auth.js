import * as API from "../api"
import { writable } from "svelte/store"

const createAuthStore = () => {
  const store = writable(null)

  // Fetches the user object if someone is logged in and has reloaded the page
  const fetchUser = async () => {
    const user = await API.fetchSelf()
    store.set(user)
  }

  return {
    subscribe: store.subscribe,
    actions: { fetchUser },
  }
}

export const authStore = createAuthStore()
