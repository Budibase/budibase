import { writable, get } from "svelte/store"
import { API } from "api"
import { auth } from "stores/portal"
import { banner } from "@budibase/bbui"

export const DEFAULT_CONFIG = {
  loaded: false,
  multiTenancy: false,
  cloud: false,
  isDev: false,
  disableAccountPortal: false,
  accountPortalUrl: "",
  importComplete: false,
  checklist: {
    apps: { checked: false },
    smtp: { checked: false },
    adminUser: { checked: false },
    sso: { checked: false },
  },
  offlineMode: false,
}

export function createAdminStore() {
  const admin = writable(DEFAULT_CONFIG)

  async function init() {
    await getChecklist()
    await getEnvironment()
    // enable system status checks in the cloud
    if (get(admin).cloud) {
      await getSystemStatus()
      checkStatus()
    }

    admin.update(store => {
      store.loaded = true
      return store
    })
  }

  async function getEnvironment() {
    const environment = await API.getEnvironment()
    admin.update(store => {
      store.multiTenancy = environment.multiTenancy
      store.cloud = environment.cloud
      store.disableAccountPortal = environment.disableAccountPortal
      store.accountPortalUrl = environment.accountPortalUrl
      store.isDev = environment.isDev
      store.baseUrl = environment.baseUrl
      store.offlineMode = environment.offlineMode
      return store
    })
  }

  const checkStatus = async () => {
    const health = get(admin)?.status?.health
    if (!health?.passing) {
      await banner.showStatus()
    }
  }

  async function getSystemStatus() {
    const status = await API.getSystemStatus()
    admin.update(store => {
      store.status = status
      return store
    })
  }

  async function getChecklist() {
    const tenantId = get(auth).tenantId
    const checklist = await API.getChecklist(tenantId)
    admin.update(store => {
      store.checklist = checklist
      return store
    })
  }

  function unload() {
    admin.update(store => {
      store.loaded = false
      return store
    })
  }

  return {
    subscribe: admin.subscribe,
    init,
    unload,
    getChecklist,
  }
}

export const admin = createAdminStore()
