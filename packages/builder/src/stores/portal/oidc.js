import { writable, get } from "svelte/store"
import api from "builderStore/api"
import { auth } from "stores/portal"

const OIDC_CONFIG = {
  logo: undefined,
  name: undefined,
  uuid: undefined,
}

export function createOidcStore() {
  const store = writable(OIDC_CONFIG)
  const { set, subscribe } = store

  async function init() {
    const tenantId = get(auth).tenantId
    const res = await api.get(`/api/admin/configs/public/oidc?tenantId=${tenantId}`)
    const json = await res.json()

    if (json.status === 400 || Object.keys(json).length === 0) {
      set(OIDC_CONFIG)
    } else {
      // Just use the first config for now. We will be support multiple logins buttons later on.
      set(...json)
    }
  }

  return {
    subscribe,
    set,
    init,
  }
}

export const oidc = createOidcStore()
