import { writable } from "svelte/store"
import { API } from "api"

export function createEnvironmentStore() {
  const { subscribe, set, update } = writable([])

  async function loadVariables() {
    let envVars = []
    envVars = await API.fetchEnvironmentVariables()
    const mappedVars = envVars.variables.map(name => ({ name }))
    set(mappedVars)
  }

  async function createVariable(data) {
    console.log(data)
    await API.createEnvironmentVariable(data)
    let mappedVar = { name: data.name }
    update(envVars => [mappedVar, ...envVars])
  }

  async function deleteVariable(varName) {
    await API.deleteEnvironmentVariable(varName)
    update(envVars => envVars.filter(envVar => envVar.name !== varName))
  }

  async function updateVariable(data) {
    await API.updateEnvironmentVariable(data)
  }

  return {
    subscribe,
    loadVariables,
    createVariable,
    deleteVariable,
    updateVariable,
  }
}

export const environment = createEnvironmentStore()
