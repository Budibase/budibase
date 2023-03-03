import { writable, get } from "svelte/store"
import { API } from "api"
import { licensing } from "stores/portal"

export function createAuditLogsStore() {
  const { subscribe, update } = writable({
    events: {},
    logs: {},
  })

  async function search(opts = {}) {
    if (get(licensing).auditLogsEnabled) {
      const paged = await API.searchAuditLogs(opts)

      update(state => {
        return { ...state, logs: { ...paged, opts } }
      })

      return paged
    }
  }

  async function getEventDefinitions() {
    const events = await API.getEventDefinitions()

    update(state => {
      return { ...state, ...events }
    })
  }

  function getDownloadUrl(opts = {}) {
    return API.getDownloadUrl(opts)
  }

  return {
    subscribe,
    search,
    getEventDefinitions,
    getDownloadUrl,
  }
}

export const auditLogs = createAuditLogsStore()
