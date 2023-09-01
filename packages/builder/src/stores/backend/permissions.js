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
    remove: async ({ level, role, resource }) => {
      return await API.removePermissionFromResource({
        resourceId: resource,
        roleId: role,
        level,
      })
    },
    forResource: async resourceId => {
      return (await API.getPermissionForResource(resourceId)).permissions
    },
    forResourceDetailed: async resourceId => {
      return await API.getPermissionForResource(resourceId)
    },
    getDependantsInfo: async resourceId => {
      return await API.getDependants(resourceId)
    },
  }
}

export const permissions = createPermissionStore()
