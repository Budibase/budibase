import { writable, get } from "svelte/store"
import { API } from "api"
import { auth } from "stores/portal"

const DEFAULT_CONFIG = {
  platformUrl: "",
  logoUrl: undefined,
  docsUrl: undefined,
  company: "Budibase",
  oidc: undefined,
  google: undefined,
  oidcCallbackUrl: "",
  googleCallbackUrl: "",
}

export function createOrganisationStore() {
  const store = writable(DEFAULT_CONFIG)
  const { subscribe, set } = store

  async function init() {
    const tenantId = get(auth).tenantId
    const tenant = await API.getTenantConfig(tenantId)
    set({ ...DEFAULT_CONFIG, ...tenant.config, _rev: tenant._rev })
  }

  async function save(config) {
    // Delete non-persisted fields
    const storeConfig = get(store)
    delete storeConfig.oidc
    delete storeConfig.google
    delete storeConfig.oidcCallbackUrl
    delete storeConfig.googleCallbackUrl
    await API.saveConfig({
      type: "settings",
      config: { ...get(store), ...config },
      _rev: get(store)._rev,
    })
    await init()
  }

  return {
    subscribe,
    set,
    save,
    init,
  }
}

export const organisation = createOrganisationStore()
