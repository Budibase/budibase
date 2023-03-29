import { writable, get } from "svelte/store"
import { API } from "api"

export function tenantsStore() {
  const store = writable({ tenantInfo: {} })

  return {
    info: async tenantId => {
      const contents = get(store)
      const found = contents.tenantInfo[tenantId]
      if (found) {
        return found
      }
      const tenantInfo = await API.getTenantInfo(tenantId)
      store.update(state => {
        state.tenantInfo[tenantId] = tenantInfo
        return state
      })
      return tenantInfo
    },
  }
}

export const tenants = tenantsStore()
