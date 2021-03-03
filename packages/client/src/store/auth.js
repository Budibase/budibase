import * as API from "../api"
import { writable, get } from "svelte/store"
import { initialise } from "./initialise"
import { routeStore } from "./routes"
import { builderStore } from "./builder"
import { TableNames } from "../constants"

const createAuthStore = () => {
  const store = writable(null)

  const goToDefaultRoute = () => {
    // Setting the active route forces an update of the active screen ID,
    // even if we're on the same URL
    routeStore.actions.setActiveRoute("/")

    // Navigating updates the URL to reflect this route
    routeStore.actions.navigate("/")
  }

  // Logs a user in
  const logIn = async ({ email, password }) => {
    const user = await API.logIn({ email, password })
    if (!user.error) {
      await fetchUser()
      await initialise()
      goToDefaultRoute()
    }
  }

  // Logs a user out
  const logOut = async () => {
    store.set(null)
    const appId = get(builderStore).appId
    if (appId) {
      for (let environment of ["local", "cloud"]) {
        window.document.cookie = `budibase:${appId}:${environment}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
      }
    }
    await initialise()
    goToDefaultRoute()
  }

  // Fetches the user object if someone is logged in and has reloaded the page
  const fetchUser = async () => {
    // Fetch the first user if inside the builder
    if (get(builderStore).inBuilder) {
      const users = await API.fetchTableData(TableNames.USERS)
      if (!users.error && users[0] != null) {
        store.set(users[0])
      }
    }

    // Or fetch the current user from localstorage in a real app
    else {
      const user = await API.fetchSelf()
      store.set(user)
    }
  }

  return {
    subscribe: store.subscribe,
    actions: { logIn, logOut, fetchUser },
  }
}

export const authStore = createAuthStore()
