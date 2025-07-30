import { API } from "@/api"
import { App, Layout, Screen } from "@budibase/types"
import { derived, get, writable } from "svelte/store"

interface AppStoreState {
  appId: string | null
  isDevApp: boolean
  clientLoadTime: number | null
  embedded: boolean
  inIframe: boolean
  screens?: Screen[]
  layouts?: Layout[]
  application?: App
  pageWidth?: string
  recaptchaKey?: string
}

const initialState: AppStoreState = {
  appId: null,
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
  const setAppId = (id: string) => {
    store.update(state => {
      return { ...state, appId: id }
    })
  }

  const setAppEmbedded = (embedded: boolean) => {
    store.update(state => {
      return { ...state, embedded }
    })
  }

  return {
    subscribe: derivedStore.subscribe,
    actions: { setAppId, setAppEmbedded, fetchAppDefinition },
  }
}

export const appStore = createAppStore()
