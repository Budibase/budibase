import * as API from "../api"
import { getAppId } from "../utils"
import { writable } from "svelte/store"

const createAuthStore = () => {
  const store = writable("")

  /**
   * Logs a user in.
   */
  const logIn = async ({ username, password }) => {
    const user = await API.logIn({ username, password })
    if (!user.error) {
      store.set(user.token)
      location.reload()
    }
  }

  /**
   * Logs a user out.
   */
  const logOut = () => {
    store.set("")
    const appId = getAppId()
    if (appId) {
      for (let environment of ["local", "cloud"]) {
        window.document.cookie = `budibase:${appId}:${environment}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
      }
    }
    location.reload()
  }

  return {
    subscribe: store.subscribe,
    actions: { logIn, logOut },
  }
}

export const authStore = createAuthStore()
