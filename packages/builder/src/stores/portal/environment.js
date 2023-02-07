import { writable, get } from "svelte/store"
import { API } from "api"
import { Constants } from "@budibase/frontend-core"
import { licensing } from "stores/portal"

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
    if (get(licensing).environmentVariablesEnabled) {
      const envVars = await API.fetchEnvironmentVariables()
      const mappedVars = envVars.variables.map(name => ({ name }))
      update(store => {
        store.variables = mappedVars
        return store
      })
    }
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

  async function upgradePanelOpened() {
    await API.publishEvent(
      Constants.EventPublishType.ENV_VAR_UPGRADE_PANEL_OPENED
    )
  }

  return {
    subscribe,
    checkStatus,
    loadVariables,
    createVariable,
    deleteVariable,
    updateVariable,
    upgradePanelOpened,
  }
}

export const environment = createEnvironmentStore()
