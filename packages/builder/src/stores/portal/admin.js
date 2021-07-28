import { writable } from "svelte/store"
import api from "builderStore/api"
import { addTenantToUrl } from "./tenancy"

export function createAdminStore() {
  const admin = writable({})

  async function init() {
    await multiTenancyEnabled()
  }

  async function checklist() {
    try {
      const response = await api.get(
        addTenantToUrl(`/api/admin/configs/checklist`)
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
      const response = await api.get(`/api/global/flags`)
      const json = await response.json()
      enabled = json.multiTenancy
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
    checklist
  }
}

export const admin = createAdminStore()
