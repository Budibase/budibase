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

  async function searchBackups({ appId, trigger, page, startDate, endDate }) {
    return API.searchBackups({ appId, trigger, page, startDate, endDate })
  }

  async function restoreBackup({ appId, backupId }) {
    return API.restoreBackup({ appId, backupId })
  }

  async function deleteBackup({ appId, backupId }) {
    return API.deleteBackup({ appId, backupId })
  }

  async function createManualBackup(appId, name) {
    return API.createManualBackup(appId, name)
  }

  async function downloadBackup({ appId, backupId }) {
    return API.downloadBackup({ appId, backupId })
  }

  async function updateBackup({ appId, backupId, name }) {
    return API.updateBackup({ appId, backupId, name })
  }

  return {
    createManualBackup,
    searchBackups,
    selectBackup,
    deleteBackup,
    restoreBackup,
    downloadBackup,
    updateBackup,
    subscribe: store.subscribe,
  }
}

export const backups = createBackupsStore()
