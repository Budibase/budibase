import { writable } from "svelte/store"
import api from "builderStore/api"

export function createPermissionStore() {
  const { subscribe } = writable([])

  return {
    subscribe,
    save: async ({ level, role, resource }) => {
      const response = await api.post(
        `/api/permission/${role}/${resource}/${level}`
      )
      const json = await response.json()
      return json
    },
    forResource: async resourceId => {
      const response = await api.get(`/api/permission/${resourceId}`)
      const json = await response.json()
      return json
    },
  }
}

export const permissions = createPermissionStore()
