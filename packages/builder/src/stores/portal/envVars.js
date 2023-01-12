import { writable } from "svelte/store"
import { API } from "api"

export function createEnvVarsStore() {
  const { subscribe, set, update } = writable([])

  async function load() {
    // const envVars = await API.fetchEnvVars()
    let testVars = ["blah", "blah123"]
    const vars = testVars.map(name => ({ name }))
    console.log(vars)
    set(vars)
  }

  async function create() {
    const envVar = await API.createEnvVar()
    update(envVars => [envVar, ...envVars])
  }

  return {
    subscribe,
    load,
    create,
  }
}

export const envVars = createEnvVarsStore()
