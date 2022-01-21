import { writable, get } from "svelte/store"
import { API } from "api"
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
      const checklist = await API.getChecklist(tenantId)
      const totalSteps = Object.keys(checklist).length
      const completedSteps = Object.values(checklist).filter(
        x => x?.checked
      ).length
      await getEnvironment()
      admin.update(store => {
        store.loaded = true
        store.checklist = checklist
        store.onboardingProgress = (completedSteps / totalSteps) * 100
        return store
      })
    } catch (error) {
      admin.update(store => {
        store.checklist = null
        return store
      })
    }
  }

  async function checkImportComplete() {
    try {
      const result = await API.checkImportComplete()
      admin.update(store => {
        store.importComplete = result ? result.imported : false
        return store
      })
    } catch (error) {
      admin.update(store => {
        store.importComplete = false
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
      const environment = await API.getEnvironment()
      multiTenancyEnabled = environment.multiTenancy
      cloud = environment.cloud
      disableAccountPortal = environment.disableAccountPortal
      accountPortalUrl = environment.accountPortalUrl
      isDev = environment.isDev
    } catch (err) {
      // Just let it stay disabled
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
