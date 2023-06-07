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

  async function searchBackups({
    appId,
    trigger,
    type,
    page,
    startDate,
    endDate,
  }) {
    return API.searchBackups({ appId, trigger, type, page, startDate, endDate })
  }

  async function restoreBackup({ appId, backupId, name }) {
    return API.restoreBackup({ appId, backupId, name })
  }

  async function deleteBackup({ appId, backupId }) {
    return API.deleteBackup({ appId, backupId })
  }

  async function createManualBackup(appId) {
    return API.createManualBackup(appId)
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
    updateBackup,
    subscribe: store.subscribe,
  }
}

export const backups = createBackupsStore()
