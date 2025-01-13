import { API } from "api"
import { writable } from "svelte/store"

const createAuthStore = () => {
  const store = writable<{
    csrfToken?: string
  } | null>(null)

  // Fetches the user object if someone is logged in and has reloaded the page
  const fetchUser = async () => {
    let globalSelf = null
    let appSelf = null

    // First try and get the global user, to see if we are logged in at all
    try {
      globalSelf = await API.fetchBuilderSelf()
    } catch (error) {
      store.set(null)
      return
    }

    // Then try and get the user for this app to provide via context
    try {
      appSelf = await API.fetchSelf()
    } catch (error) {
      // Swallow
    }

    // Use the app self if present, otherwise fallback to the global self
    store.set(appSelf || globalSelf || null)
  }

  const logOut = async () => {
    try {
      await API.logOut()
    } catch (error) {
      // Do nothing
    }

    // Manually destroy cookie to be sure
    window.document.cookie = `budibase:auth=; budibase:currentapp=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  }

  return {
    subscribe: store.subscribe,
    actions: { fetchUser, logOut },
  }
}

export const authStore = createAuthStore()
