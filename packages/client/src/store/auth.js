import * as API from "../api"
import { writable } from "svelte/store"
import { initialise } from "./initialise"

const createAuthStore = () => {
  const store = writable(null)

  const goToDefaultRoute = () => {
    // Setting the active route forces an update of the active screen ID,
    // even if we're on the same URL
    routeStore.actions.setActiveRoute("/")

    // Navigating updates the URL to reflect this route
    routeStore.actions.navigate("/")
  }


  // Fetches the user object if someone is logged in and has reloaded the page
  const fetchUser = async () => {
    const user = await API.fetchSelf()
    store.set(user)
  }

  const logOut = async () => {
    store.set(null)
    window.document.cookie = `budibase:auth=; budibase:currentapp=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
    await initialise()
    goToDefaultRoute()
  }

  return {
    subscribe: store.subscribe,
    actions: { fetchUser, logOut },
  }
}

export const authStore = createAuthStore()
