import { writable } from "svelte/store"
import { API } from "api"

export function createBackupsStore() {
  const store = writable({})

  function selectBackup(backupId) {
    store.update(state => {
      state.selectedBackup = backupId
      return state
    })
  }

  async function searchBackups(appId, opts) {
    return API.searchBackups(appId, opts)
  }

  async function restoreBackup(appId, backupId, name) {
    return API.restoreBackup(appId, backupId, name)
  }

  async function deleteBackup(appId, backupId) {
    return API.deleteBackup(appId, backupId)
  }

  async function createManualBackup(appId) {
    return API.createManualBackup(appId)
  }

  return {
    createManualBackup,
    searchBackups,
    selectBackup,
    deleteBackup,
    restoreBackup,
    subscribe: store.subscribe,
  }
}

export const backups = createBackupsStore()
