import { API } from "api"
import { writable } from "svelte/store"

const createMediaStore = () => {
  const store = writable({})

  const fetchMedia = async () => {
    // First try and get the global user, to see if we are logged in at all
    try {
      const resp = await API.fetchTenantMedia()
      // Use the app self if present, otherwise fallback to the global self
      store.set(
        resp.assets.reduce((acc, item) => {
          acc[item.name] = item.url
          return acc
        }, {})
      )
    } catch (error) {
      store.set({})
      return
    }
  }

  return {
    subscribe: store.subscribe,
    actions: { fetchMedia },
  }
}

export const mediaStore = createMediaStore()
