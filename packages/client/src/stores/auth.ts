import { API } from "@/api"
import {
  ContextUserMetadata,
  GetGlobalSelfResponse,
  SelfResponse,
} from "@budibase/types"
import { writable } from "svelte/store"

type AuthState = ContextUserMetadata | GetGlobalSelfResponse | undefined

const createAuthStore = () => {
  const store = writable<AuthState>()

  const hasAppSelfUser = (
    user: SelfResponse | null
  ): user is ContextUserMetadata => {
    return user != null && "_id" in user
  }

  // Fetches the user object if someone is logged in and has reloaded the page
  const fetchUser = async () => {
    let globalSelf, appSelf

    // First try and get the global user, to see if we are logged in at all
    try {
      globalSelf = await API.fetchBuilderSelf()
    } catch (error) {
      store.set(undefined)
      return
    }

    // Then try and get the user for this app to provide via context
    try {
      const res = await API.fetchSelf()
      if (hasAppSelfUser(res)) {
        appSelf = res
      }
    } catch (error) {
      // Swallow
    }

    // Use the app self if present, otherwise fallback to the global self
    store.set(appSelf || globalSelf)
  }

  const logOut = async () => {
    try {
      await API.logOut()
      window.location.href = "/"
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
