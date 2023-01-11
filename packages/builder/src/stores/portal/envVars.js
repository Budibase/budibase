import { writable } from "svelte/store"
import { API } from "api"

export function createEnvVarsStore() {
  const { subscribe, set, update } = writable([])

  async function load() {
    const envVars = await API.fetchEnvVars()

    let testVars = ["blah", "blah123"]
    set(testVars)
  }

  return {
    subscribe,
    load,
  }
}

export const envVars = createEnvVarsStore()
