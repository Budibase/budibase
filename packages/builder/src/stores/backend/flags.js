import { writable } from "svelte/store"
import api from "builderStore/api"

export function createFlagsStore() {
  const { subscribe, set } = writable({})

  return {
    subscribe,
    fetch: async () => {
      const { doc, response } = await getFlags()
      set(doc)
      return response
    },
    updateFlag: async (flag, value) => {
      const response = await api.post("/api/users/flags", {
        flag,
        value,
      })
      if (response.status === 200) {
        const { doc } = await getFlags()
        set(doc)
      }
      return response
    },
  }
}

async function getFlags() {
  const response = await api.get("/api/users/flags")
  let doc = {}
  if (response.status === 200) {
    doc = await response.json()
  }
  return { doc, response }
}

export const flags = createFlagsStore()
