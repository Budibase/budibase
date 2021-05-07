import { writable } from "svelte/store"
import { get } from "builderStore/api"

export function createAppStore() {
  const store = writable([])

  async function load() {
    try {
      const res = await get("/api/applications")
      const json = await res.json()
      if (res.ok && Array.isArray(json)) {
        store.set(json)
      } else {
        store.set([])
      }
    } catch (error) {
      store.set([])
    }
  }

  return {
    subscribe: store.subscribe,
    load,
  }
}

export const apps = createAppStore()
