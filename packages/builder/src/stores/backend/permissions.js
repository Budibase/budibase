import { writable } from "svelte/store"
import api from "builderStore/api"


export function createPermissionStore() {
  const { subscribe } = writable([])

  return {
    subscribe,
    forResource: async resourceId => {
      const response = await api.get(`/api/permission/${resourceId}`)
      const json = await response.json()
      return json
    },
  }
}

export const permissions = createPermissionStore()
