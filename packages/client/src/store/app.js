import * as API from "../api"
import { get, writable } from "svelte/store"

const createAppStore = () => {
  const store = writable({})

  // Fetches the app definition including screens, layouts and theme
  const fetchAppDefinition = async () => {
    const appDefinition = await API.fetchAppPackage(get(store).appId)
    store.set(appDefinition)
  }

  // Sets the initial app ID
  const setAppID = id => {
    store.update(state => {
      state.appId = id
      return state
    })
  }

  return {
    subscribe: store.subscribe,
    actions: { setAppID, fetchAppDefinition },
  }
}

export const appStore = createAppStore()
