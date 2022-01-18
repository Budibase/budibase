import { writable } from "svelte/store"
import api from "builderStore/api"

export function templatesStore() {
  const { subscribe, set } = writable([])

  async function load() {
    const response = await api.get("/api/templates?type=app")
    const json = await response.json()
    set(json)
  }

  return {
    subscribe,
    load,
  }
}

export const templates = templatesStore()
