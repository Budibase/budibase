import { writable } from "svelte/store"
import api from "builderStore/api"

const FALLBACK_CONFIG = {
  platformUrl: "",
  logoUrl: "",
  docsUrl: "",
  company: "",
}

export function createOrganisationStore() {
  const { subscribe, set } = writable({})

  async function init() {
      const response = await api.get(`/api/admin/configs/settings`)
      const json = await response.json()
      if (json.status === 400) {
        set({ config: FALLBACK_CONFIG})
      } else {
        set(json)
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
        return { status: error }
      }
    },
    init,
  }
}

export const organisation = createOrganisationStore()
