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

const buildOpts = (opts: SearchAuditLogsRequest) => {
  const { bookmark, startDate, endDate, fullSearch, events, userIds, appIds } =
    opts
  const parsedOpts: SearchAuditLogsRequest = {}

  if (bookmark) {
    parsedOpts.bookmark = bookmark
  }

  if (opts.startDate && endDate) {
    parsedOpts.startDate = startDate
    parsedOpts.endDate = endDate
  } else if (startDate && !endDate) {
    parsedOpts.startDate = startDate
  }

  if (fullSearch) {
    parsedOpts.fullSearch = fullSearch
  }

  if (events?.length) {
    parsedOpts.events = events
  }

  if (userIds?.length) {
    parsedOpts.userIds = userIds
  }

  if (appIds?.length) {
    parsedOpts.appIds = appIds
  }

  return parsedOpts
}

export const buildAuditLogEndpoints = (
  API: BaseAPIClient
): AuditLogEndpoints => ({
  searchAuditLogs: async opts => {
    return await API.post({
      url: `/api/global/auditlogs/search`,
      body: buildOpts(opts),
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
