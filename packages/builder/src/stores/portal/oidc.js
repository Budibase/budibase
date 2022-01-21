import { writable, get } from "svelte/store"
import { API } from "api"
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
    try {
      const config = await API.getOIDCConfig(tenantId)
      if (Object.keys(config || {}).length) {
        // Just use the first config for now.
        // We will be support multiple logins buttons later on.
        set(...config)
      } else {
        set(OIDC_CONFIG)
      }
    } catch (error) {
      set(OIDC_CONFIG)
    }
  }

  return {
    subscribe,
    set,
    init,
  }
}

export const oidc = createOidcStore()
