import * as API from "../api"
import { writable } from "svelte/store"

const createAuthStore = () => {
  const store = writable(null)

  // Fetches the user object if someone is logged in and has reloaded the page
  const fetchUser = async () => {
    const user = await API.fetchSelf()
    store.set(user)
  }

  const logOut = async () => {
    window.document.cookie = `budibase:auth=; budibase:currentapp=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
    window.location.reload()
  }

  return {
    subscribe: store.subscribe,
    actions: { fetchUser, logOut },
  }
}

export const authStore = createAuthStore()
