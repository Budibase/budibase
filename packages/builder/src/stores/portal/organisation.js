import { writable } from "svelte/store"
import api from "builderStore/api"

export function createOrganisationStore() {
  const { subscribe, set } = writable({})

  async function init() {
    try {
      const response = await api.get(`/api/admin/configs/settings`)
      const json = await response.json()
      set(json)
    } catch (error) {
      set({
        platformUrl: "",
        logoUrl: "",
        docsUrl: "",
        company: "",
      })
    }
  }

  return {
    subscribe,
    save: async config => {
      try {
        await api.post("/api/admin/configs", { type: "settings", config })
        await init()
        return { status: 200 }
      } catch (error) {
        return { error }
      }
    },
    init,
  }
}

export const organisation = createOrganisationStore()
