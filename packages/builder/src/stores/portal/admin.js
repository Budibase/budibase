import { writable, get } from "svelte/store"
import api from "builderStore/api"
import { auth } from "stores/portal"

export function createAdminStore() {
  const DEFAULT_CONFIG = {
    loaded: false,
    multiTenancy: false,
    cloud: false,
    isDev: false,
    disableAccountPortal: false,
    accountPortalUrl: "",
    importComplete: false,
    onboardingProgress: 0,
    checklist: {
      apps: { checked: false },
      smtp: { checked: false },
      adminUser: { checked: false },
      sso: { checked: false },
    },
  }

  const admin = writable(DEFAULT_CONFIG)

  async function init() {
    try {
      const tenantId = get(auth).tenantId
      const response = await api.get(
        `/api/global/configs/checklist?tenantId=${tenantId}`
      )
      const json = await response.json()
      const totalSteps = Object.keys(json).length
      const completedSteps = Object.values(json).filter(x => x?.checked).length

      await getEnvironment()
      admin.update(store => {
        store.loaded = true
        store.checklist = json
        store.onboardingProgress = (completedSteps / totalSteps) * 100
        return store
      })
    } catch (err) {
      admin.update(store => {
        store.checklist = null
        return store
      })
    }
  }

  async function checkImportComplete() {
    const response = await api.get(`/api/cloud/import/complete`)
    if (response.status === 200) {
      const json = await response.json()
      admin.update(store => {
        store.importComplete = json ? json.imported : false
        return store
      })
    }
  }

  async function getEnvironment() {
    let multiTenancyEnabled = false
    let cloud = false
    let disableAccountPortal = false
    let accountPortalUrl = ""
    let isDev = false
    try {
      const response = await api.get(`/api/system/environment`)
      const json = await response.json()
      multiTenancyEnabled = json.multiTenancy
      cloud = json.cloud
      disableAccountPortal = json.disableAccountPortal
      accountPortalUrl = json.accountPortalUrl
      isDev = json.isDev
    } catch (err) {
      // just let it stay disabled
    }
    admin.update(store => {
      store.multiTenancy = multiTenancyEnabled
      store.cloud = cloud
      store.disableAccountPortal = disableAccountPortal
      store.accountPortalUrl = accountPortalUrl
      store.isDev = isDev
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
    checkImportComplete,
    unload,
  }
}

export const admin = createAdminStore()
