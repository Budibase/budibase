import { writable } from "svelte/store"
import { API } from "@/api"

export function templatesStore() {
  const { subscribe, set } = writable([])

  return {
    subscribe,
    load: async () => {
      const templates = await API.getAppTemplates()
      set(templates)
    },
  }
}

export const templates = templatesStore()
