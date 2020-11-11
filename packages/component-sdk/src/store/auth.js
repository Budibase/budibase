import { localStorageStore } from "../../../builder/src/builderStore/store/localStorage"
import * as api from "../api"

const initialState = {
  user: null,
}

export const createAuthStore = () => {
  const store = localStorageStore("bb-app-auth", initialState)

  /**
   * Logs a user in.
   *
   * @param username
   * @param password
   * @returns {Promise<void>}
   */
  const logIn = async ({ username, password }) => {
    const user = await api.logIn({ username, password })
    if (!user.error) {
      store.update(state => {
        state.user = user
        return state
      })
    }
  }

  /**
   * Logs a user out.
   */
  const logOut = () => {
    store.update(() => initialState)
  }

  store.actions = {
    logIn,
    logOut,
  }

  return store
}
