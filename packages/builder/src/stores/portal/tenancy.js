import { auth, admin } from "stores/portal"
import { get } from "svelte/store"

export const addTenantToUrl = url => {
  const authStore = get(auth)
  const adminStore = get(admin)

  const tenantId = authStore.tenantId
  const isMultiTenant = adminStore.multiTenancy

  // TODO: Should we just use 'default' here and drop isMultiTenant check?
  if (isMultiTenant) {
    const char = url.indexOf("?") === -1 ? "?" : "&"
    url += `${char}tenantId=${tenantId}`
  }

  return url
}
