import { get } from "svelte/store"
import { API } from "@/api"
import { licensing } from "./licensing"
import { BudiStore } from "../BudiStore"
import {
  DownloadAuditLogsRequest,
  SearchAuditLogsRequest,
  SearchAuditLogsResponse,
} from "@budibase/types"

interface PortalAuditLogsStore {
  events?: Record<string, string>
  logs?: SearchAuditLogsResponse
}

export class AuditLogsStore extends BudiStore<PortalAuditLogsStore> {
  constructor() {
    super({})
  }

  async search(opts: SearchAuditLogsRequest = {}) {
    if (get(licensing).auditLogsEnabled) {
      const res = await API.searchAuditLogs(opts)
      this.update(state => ({
        ...state,
        logs: res,
      }))
      return res
    }
  }

  async getEventDefinitions() {
    const res = await API.getEventDefinitions()
    this.update(state => ({
      ...state,
      events: res.events,
    }))
  }

  getDownloadUrl(opts: DownloadAuditLogsRequest = {}) {
    return API.getDownloadUrl(opts)
  }
}

export const auditLogs = new AuditLogsStore()
