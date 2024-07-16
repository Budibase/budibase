import { writable } from "svelte/store"
import { API } from "api"

export function createPermissionStore() {
  const store = writable({})

  return {
    subscribe: store.subscribe,
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
    cachedForResource: async (resourceId) => {
      const inFlightRequest = store[resourceId];

      if (inFlightRequest instanceof Promise) {
        return inFlightRequest
      }
      const request = API.getPermissionForResource(resourceId)
      store.set({ ...store, resourceId: request });

      return request;
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
