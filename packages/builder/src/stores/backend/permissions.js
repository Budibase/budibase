import { writable } from "svelte/store"
import api from "builderStore/api"


export function createPermissionStore() {
  const { subscribe, set } = writable([])

  return {
    subscribe,
    fetchLevels: async () => {
      const response = await api.get("/api/permission/levels")
      const json = await response.json()
      set(json)
    },
    forResource: async resourceId => {
      const response = await api.get(`/api/permission/${resourceId}`)
      const json = await response.json()
      return json
    },
    save: async ({ role, resource, level }) => {
      const response = await api.post(
        `/api/permission/${role}/${resource}/${level}`
      )
      const json = await response.json()
      return json
    },
  }
}

export const permissions = createPermissionStore()
