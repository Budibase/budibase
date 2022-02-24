import { API } from "api"
import { get, writable } from "svelte/store"

const initialState = {
  appId: null,
  isDevApp: false,
  clientLoadTime: window.INIT_TIME ? Date.now() - window.INIT_TIME : null,
}

const createAppStore = () => {
  const store = writable(initialState)

  // Fetches the app definition including screens, layouts and theme
  const fetchAppDefinition = async () => {
    const appId = get(store)?.appId
    if (!appId) {
      throw "Cannot fetch app definition without app ID set"
    }
    try {
      const appDefinition = await API.fetchAppPackage(appId)
      store.set({
        ...initialState,
        ...appDefinition,
        appId: appDefinition?.application?.appId,
        isDevApp: appId.startsWith("app_dev"),
      })
    } catch (error) {
      store.set(initialState)
    }
  }

  // Sets the initial app ID
  const setAppID = id => {
    store.update(state => {
      if (state) {
        state.appId = id
      } else {
        state = { appId: id }
      }
      return state
    })
  }

  return {
    subscribe: store.subscribe,
    actions: { setAppID, fetchAppDefinition },
  }
}

export const appStore = createAppStore()
