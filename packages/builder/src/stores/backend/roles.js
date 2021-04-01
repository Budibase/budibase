import { writable } from "svelte/store"
import api from "builderStore/api"

export function createRolesStore() {
  const { subscribe, update, set } = writable([])

  return {
    subscribe,
    fetch: async () => {
      set(await getRoles())
    },
    delete: async role => {
      const response = await api.delete(`/api/roles/${role._id}/${role._rev}`)
      update(state => state.filter(existing => existing._id !== role._id))
      return response
    },
    save: async role => {
      const response = await api.post("/api/roles", role)
      set(await getRoles())
      return response
    },
  }
}

async function getRoles() {
  const response = await api.get("/api/roles")
  return await response.json()
}

export const roles = createRolesStore()
