import { writable, get } from "svelte/store"
import { API } from "api"
import { licensing } from "stores/portal"

export function createAuditLogsStore() {
  const { subscribe, set } = writable({
    logs: [],
  })

  async function search(opts = {}) {
    if (get(licensing).auditLogsEnabled) {
      const paged = await API.searchAuditLogs(opts)
      set({
        ...paged,
        ...opts,
      })
      return paged
    }
  }

  async function getEventDefinitions() {
    return await API.getEventDefinitions()
  }

  async function downloadLogs(opts = {}) {
    return await API.downloadLogs(opts)
  }

  return {
    subscribe,
    search,
    getEventDefinitions,
    downloadLogs,
  }
}

export const auditLogs = createAuditLogsStore()
