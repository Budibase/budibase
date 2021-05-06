import { writable } from "svelte/store"
import api from "builderStore/api"

export function createAdminStore() {
  const { subscribe, set } = writable({})

  async function init() {
    try {
      const response = await api.get("/api/admin/configs/checklist")
      const json = await response.json()

      const onboardingSteps = Object.keys(json)

      const stepsComplete = onboardingSteps.reduce(
        (score, step) => score + Number(!!json[step]),
        0
      )

      set({
        checklist: json,
        onboardingProgress: (stepsComplete / onboardingSteps.length) * 100,
      })
    } catch (err) {
      set({
        checklist: null,
      })
    }
  }

  return {
    subscribe,
    init,
  }
}

export const admin = createAdminStore()
