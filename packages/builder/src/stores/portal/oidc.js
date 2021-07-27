import { writable } from "svelte/store"
import api from "builderStore/api"

const OIDC_CONFIG = {
  logo: undefined,
  name: undefined,
  uuid: undefined,
}

export function createOidcStore() {
  const store = writable(OIDC_CONFIG)
  const { set, subscribe } = store

  async function init() {
    const res = await api.get(`/api/admin/configs/publicOidc`)
    const json = await res.json()

    if (json.status === 400) {
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
