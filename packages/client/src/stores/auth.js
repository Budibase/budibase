import * as API from "../api"
import { writable } from "svelte/store"
import { devToolsStore } from "./devTools"
import { get } from "svelte/store"

const createAuthStore = () => {
  const store = writable(null)

  // Fetches the user object if someone is logged in and has reloaded the page
  const fetchUser = async () => {
    const user = await API.fetchSelf()
    store.set({
      ...user,
      roleId: get(devToolsStore).role || user.roleId,
    })
  }

  const logOut = async () => {
    console.log("LOG OUT")
    // window.document.cookie = `budibase:auth=; budibase:currentapp=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
    // window.location = "/builder/auth/login"
  }

  return {
    subscribe: store.subscribe,
    actions: { fetchUser, logOut },
  }
}

export const authStore = createAuthStore()
