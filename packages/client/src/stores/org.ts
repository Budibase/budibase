import { API } from "@/api"
import { writable, get } from "svelte/store"
import { appStore } from "./app"

interface OrgStore {
  logoUrl?: string
}

const createOrgStore = () => {
  const store = writable<OrgStore | null>(null)

  const { subscribe, set } = store

  async function init() {
    const tenantId = get(appStore).application?.tenantId
    if (!tenantId) return
    try {
      const settingsConfigDoc = await API.getTenantConfig(tenantId)
      set({ logoUrl: settingsConfigDoc.config.logoUrl })
    } catch (e) {
      console.error("Could not init org ", e)
    }
  }

  return {
    subscribe,
    actions: {
      init,
    },
  }
}

export const orgStore = createOrgStore()
