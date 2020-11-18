import * as api from "../api"
import { getAppId } from "../utils"
import { writable } from "svelte/store"

const createAuthStore = () => {
  const store = writable("")

  /**
   * Logs a user in.
   */
  const logIn = async ({ username, password }) => {
    const user = await api.logIn({ username, password })
    if (!user.error) {
      store.set(user.token)
    }
    return !user.error
  }

  /**
   * Logs a user out.
   */
  const logOut = () => {
    store.set("")

    // Expire any cookies
    const appId = getAppId()
    if (appId) {
      for (let environment of ["local", "cloud"]) {
        window.document.cookie = `budibase:${appId}:${environment}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
      }
    }
  }

  return {
    subscribe: store.subscribe,
    actions: { logIn, logOut },
  }
}

export const authStore = createAuthStore()
