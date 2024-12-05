import {
  SearchAuditLogsRequest,
  SearchAuditLogsResponse,
  DefinitionsAuditLogsResponse,
  DownloadAuditLogsRequest,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface AuditLogEndpoints {
  searchAuditLogs: (
    opts: SearchAuditLogsRequest
  ) => Promise<SearchAuditLogsResponse>
  getEventDefinitions: () => Promise<DefinitionsAuditLogsResponse>
  getDownloadUrl: (opts: DownloadAuditLogsRequest) => string
}

export const buildAuditLogEndpoints = (
  API: BaseAPIClient
): AuditLogEndpoints => ({
  searchAuditLogs: async opts => {
    return await API.post({
      url: `/api/global/auditlogs/search`,
      body: opts,
    })
  },
  getEventDefinitions: async () => {
    return await API.get({
      url: `/api/global/auditlogs/definitions`,
    })
  },
  getDownloadUrl: opts => {
    const query = encodeURIComponent(JSON.stringify(opts))
    return `/api/global/auditlogs/download?query=${query}`
  },
})
