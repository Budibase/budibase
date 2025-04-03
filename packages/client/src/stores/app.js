import { API } from "@/api"
import { get, writable, derived } from "svelte/store"

const initialState = {
  appId: null,
  webpageId: null,
  isDevApp: false,
  clientLoadTime: window.INIT_TIME ? Date.now() - window.INIT_TIME : null,
  embedded: false,
  inIframe: window.self !== window.top,
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
    const webpageId = get(store)?.webpageId
    if (!appId) {
      throw "Cannot fetch app definition without app ID set"
    }
    try {
      const appDefinition = await API.fetchAppPackage(appId, webpageId)
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
  const setAppId = (id, webpageId) => {
    store.update(state => {
      if (state) {
        state.appId = id
        state.webpageId = webpageId
      } else {
        state = { appId: id, webpageId }
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
