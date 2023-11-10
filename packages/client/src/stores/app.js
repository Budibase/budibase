import { API } from "api"
import { get, writable, derived } from "svelte/store"

const initialState = {
  appId: null,
  isDevApp: false,
  clientLoadTime: window.INIT_TIME ? Date.now() - window.INIT_TIME : null,
  embedded: false,
}

const createAppStore = () => {
  const store = writable(initialState)
  const derivedStore = derived(store, $store => {
    return {
      ...$store,
      isDevApp: $store.appId?.startsWith("app_dev"),
    }
  })

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
      })
    } catch (error) {
      store.set(initialState)
    }
  }

  // Sets the initial app ID
  const setAppId = id => {
    store.update(state => {
      if (state) {
        state.appId = id
      } else {
        state = { appId: id }
      }
      return state
    })
  }

  const setAppEmbedded = embeddded => {
    store.update(state => {
      if (state) {
        state.embedded = embeddded
      } else {
        state = { embeddded }
      }
      return state
    })
  }

  return {
    subscribe: derivedStore.subscribe,
    actions: { setAppId, setAppEmbedded, fetchAppDefinition },
  }
}

export const appStore = createAppStore()
