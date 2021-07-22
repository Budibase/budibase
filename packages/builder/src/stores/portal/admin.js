import { writable, get } from "svelte/store"
import api from "builderStore/api"
import { auth } from "stores/portal"

export function createAdminStore() {
  const admin = writable({})

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

      admin.update(store => {
        store.checklist = json
        store.onboardingProgress =
          (stepsComplete / onboardingSteps.length) * 100
        return store
      })
      await multiTenancyEnabled()
    } catch (err) {
      admin.update(store => {
        store.checklist = null
        return store
      })
    }
  }

  async function multiTenancyEnabled() {
    let enabled = false
    try {
      const response = await api.get(`/api/global/tenants/enabled`)
      const json = await response.json()
      enabled = json.enabled
    } catch (err) {
      // just let it stay disabled
    }
    admin.update(store => {
      store.multiTenancy = enabled
      return store
    })
    return enabled
  }

  return {
    subscribe: admin.subscribe,
    init,
  }
}

export const admin = createAdminStore()
