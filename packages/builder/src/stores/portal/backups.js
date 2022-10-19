import { writable } from "svelte/store"
import { API } from "api"

export function createBackupsStore() {
  const { subscribe, set } = writable([])

  async function load() {
    set([
      {
        trigger: "PUBLISH",
        name: "A Backup",
        date: "1665407451",
        userId: "Peter Clement",
        contents: [
          { datasources: ["datasource1", "datasource2"] },
          { screens: ["screen1", "screen2"] },
          { automations: ["automation1", "automation2"] },
        ],
      },
    ])
  }

  async function searchBackups(appId, trigger, page) {
    return API.searchBackups({ appId, trigger, page })
  }

  async function createManualBackup(appId, name) {
    let resp = API.createManualBackup(appId, name)
    return resp
  }

  return {
    subscribe,
    load,
    createManualBackup,
    searchBackups,
  }
}

export const backups = createBackupsStore()
