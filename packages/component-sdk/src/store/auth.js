import { localStorageStore } from "../../../builder/src/builderStore/store/localStorage"
import * as api from "../api"
import { getAppId } from "../utils"

const initialState = ""

export const createAuthStore = () => {
  const store = localStorageStore("budibase:token", initialState)

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
    store.set(initialState)

    // Expire any cookies
    const appId = getAppId(window.document.cookie)
    if (appId) {
      for (let environment of ["local", "cloud"]) {
        window.document.cookie = `budibase:${appId}:${environment}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
      }
    }
  }

  store.actions = {
    logIn,
    logOut,
  }

  return store
}
