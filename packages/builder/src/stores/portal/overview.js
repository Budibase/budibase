import { writable, derived } from "svelte/store"
import { apps } from "./apps"

const createOverviewStore = () => {
  const store = writable({
    selectedAppId: null,
  })
  const derivedStore = derived([store, apps], ([$store, $apps]) => {
    return {
      ...$store,
      selectedApp: $apps?.find(app => app.devId === $store.selectedAppId),
    }
  })

  return {
    update: store.update,
    subscribe: derivedStore.subscribe,
  }
}

export const overview = createOverviewStore()
