import { writable } from "svelte/store"
import { API } from "api"

export function createEnvironmentStore() {
  const { subscribe, update } = writable({
    variables: [],
    status: {},
  })

  async function checkStatus() {
    const status = await API.checkEnvironmentVariableStatus()
    update(store => {
      store.status = status
      return store
    })
  }

  async function loadVariables() {
    const envVars = await API.fetchEnvironmentVariables()
    const mappedVars = envVars.variables.map(name => ({ name }))
    update(store => {
      store.variables = mappedVars
      return store
    })
  }

  async function createVariable(data) {
    await API.createEnvironmentVariable(data)
    let mappedVar = { name: data.name }
    update(store => {
      store.variables = [mappedVar, ...store.variables]
      return store
    })
  }

  async function deleteVariable(varName) {
    await API.deleteEnvironmentVariable(varName)
    update(store => {
      store.variables = store.variables.filter(
        envVar => envVar.name !== varName
      )
      return store
    })
  }

  async function updateVariable(data) {
    await API.updateEnvironmentVariable(data)
  }

  return {
    subscribe,
    checkStatus,
    loadVariables,
    createVariable,
    deleteVariable,
    updateVariable,
  }
}

export const environment = createEnvironmentStore()
