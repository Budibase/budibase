import { writable, get } from "svelte/store"
import { API } from "@/api"
import { auth } from "@/stores/portal"
import { banner } from "@budibase/bbui"
import {
  ConfigChecklistResponse,
  GetEnvironmentResponse,
  SystemStatusResponse,
} from "@budibase/types"

interface PortalAdminStore extends GetEnvironmentResponse {
  loaded: boolean
  checklist?: ConfigChecklistResponse
  status?: SystemStatusResponse
}

export function createAdminStore() {
  const admin = writable<PortalAdminStore>({
    loaded: false,
    multiTenancy: false,
    cloud: false,
    isDev: false,
    disableAccountPortal: false,
    offlineMode: false,
    maintenance: [],
  })

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
      store.maintenance = environment.maintenance
      store.passwordMinLength = environment.passwordMinLength
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
