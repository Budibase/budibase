import { writable, get } from "svelte/store"
import api from "builderStore/api"
import { auth } from "stores/portal"

const DEFAULT_CONFIG = {
  platformUrl: "http://localhost:10000",
  helpUrl: "https://github.com/Budibase/budibase/discussions",
  logoUrl: undefined,
  docsUrl: undefined,
  company: "Budibase",
  oidc: undefined,
  google: undefined,
}

export function createOrganisationStore() {
  const store = writable(DEFAULT_CONFIG)
  const { subscribe, set } = store

  async function init() {
    const tenantId = get(auth).tenantId
    const res = await api.get(`/api/global/configs/public?tenantId=${tenantId}`)
    const json = await res.json()
    if (json.status === 400) {
      set(DEFAULT_CONFIG)
    } else {
      set({ ...DEFAULT_CONFIG, ...json.config, _rev: json._rev })
    }
  }

  async function save(config) {
    const res = await api.post("/api/global/configs", {
      type: "settings",
      config: { ...get(store), ...config },
      _rev: get(store)._rev,
    })
    const json = await res.json()
    if (json.status) {
      return json
    }
    await init()
    return { status: 200 }
  }

  return {
    subscribe,
    set,
    save,
    init,
  }
}

export const organisation = createOrganisationStore()
