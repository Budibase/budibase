import { writable, get } from "svelte/store"
import { API } from "api"
import { auth } from "stores/portal"
import _ from "lodash"

const DEFAULT_CONFIG = {
  platformUrl: "",
  logoUrl: undefined,
  faviconUrl: undefined,
  emailBrandingEnabled: true,
  testimonialsEnabled: true,
  platformTitle: "Budibase",
  loginHeading: undefined,
  loginButton: undefined,
  metaDescription: undefined,
  metaImageUrl: undefined,
  metaTitle: undefined,
  docsUrl: undefined,
  company: "Budibase",
  oidc: undefined,
  google: undefined,
  googleDatasourceConfigured: undefined,
  oidcCallbackUrl: "",
  googleCallbackUrl: "",
  isSSOEnforced: false,
  loaded: false,
}

export function createOrganisationStore() {
  const store = writable(DEFAULT_CONFIG)
  const { subscribe, set } = store

  async function init() {
    const tenantId = get(auth).tenantId
    const settingsConfigDoc = await API.getTenantConfig(tenantId)
    set({ ...DEFAULT_CONFIG, ...settingsConfigDoc.config, loaded: true })
  }

  async function save(config) {
    // Delete non-persisted fields
    const storeConfig = _.cloneDeep(get(store))
    delete storeConfig.oidc
    delete storeConfig.google
    delete storeConfig.googleDatasourceConfigured
    delete storeConfig.oidcCallbackUrl
    delete storeConfig.googleCallbackUrl

    // delete internal store field
    delete storeConfig.loaded

    await API.saveConfig({
      type: "settings",
      config: { ...storeConfig, ...config },
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
