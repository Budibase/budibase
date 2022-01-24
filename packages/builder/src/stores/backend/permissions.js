import { writable } from "svelte/store"
import { API } from "api"

export function createPermissionStore() {
  const { subscribe } = writable([])

  return {
    subscribe,
    save: async ({ level, role, resource }) => {
      return await API.updatePermissionForResource({
        resourceId: resource,
        roleId: role,
        level,
      })
    },
    forResource: async resourceId => {
      return await API.getPermissionForResource(resourceId)
    },
  }
}

export const permissions = createPermissionStore()
