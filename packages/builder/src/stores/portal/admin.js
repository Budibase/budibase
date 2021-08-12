import { writable, get } from "svelte/store"
import api from "builderStore/api"
import { auth } from "stores/portal"

export function createAdminStore() {

  const DEFAULT_CONFIG = {
    loaded: false,
    multiTenancy: false,
    sandbox: false,
    onboardingProgress: 0,
    checklist: {"apps":0,"smtp":false,"adminUser":false,"sso":false}
  }
  
  const admin = writable(DEFAULT_CONFIG)

  async function init() {
    try {
      const tenantId = get(auth).tenantId
      const response = await api.get(
        `/api/global/configs/checklist?tenantId=${tenantId}`
      )
      const json = await response.json()

      const onboardingSteps = Object.keys(json)

      const stepsComplete = onboardingSteps.reduce(
        (score, step) => score + Number(!!json[step]),
        0
      )

      await getFlags()
      admin.update(store => {
        store.loaded = true
        store.checklist = json
        store.onboardingProgress =
          (stepsComplete / onboardingSteps.length) * 100
        return store
      })
    } catch (err) {
      admin.update(store => {
        store.checklist = null
        return store
      })
    }
  }

  async function getFlags() {
    let multiTenancyEnabled = false
    let sandbox = false
    try {
      const response = await api.get(`/api/system/flags`)
      const json = await response.json()
      multiTenancyEnabled = json.multiTenancy
      sandbox = json.sandbox
    } catch (err) {
      // just let it stay disabled
    }
    admin.update(store => {
      store.multiTenancy = multiTenancyEnabled
      store.sandbox = sandbox
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
  }
}

export const admin = createAdminStore()
