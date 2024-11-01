import { writable } from "svelte/store"
import { API } from "api"

export function templatesStore() {
  const { subscribe, set } = writable([])

  return {
    subscribe,
    load: async () => {
      const templates = await API.getAppTemplates()
      // Test data remove after the UI has been built
      const newTemplate = {
        name: "test",
        category: "test",
        v3: true,
        description: "test test",
        icon: "test",
        background: "#20a3a8",
        url: "test",
      }
      templates.push(newTemplate)
      //
      set(templates)
    },
  }
}

export const templates = templatesStore()
