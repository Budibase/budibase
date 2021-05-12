import { writable, get } from "svelte/store"
import api from "builderStore/api"

const FALLBACK_CONFIG = {
  platformUrl: "",
  logoUrl: "",
  docsUrl: "",
  company: "http://localhost:10000",
}

export function createOrganisationStore() {
  const store = writable({})
  const { subscribe, set } = store

  async function init() {
    const res = await api.get(`/api/admin/configs/settings`)
    const json = await res.json()

    if (json.status === 400) {
      set(FALLBACK_CONFIG)
    } else {
      set({...json.config, _rev: json._rev})
    }
  }

  async function save(config) {
    const res = await api.post("/api/admin/configs", { type: "settings", config, _rev: get(store)._rev } )
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
