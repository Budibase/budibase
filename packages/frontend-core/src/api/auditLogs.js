const buildOpts = ({
  userIds,
  appIds,
  startDate,
  endDate,
  metadataSearch,
  events,
}) => {
  const opts = {}

  if (startDate && endDate) {
    opts.startDate = startDate
    opts.endDate = endDate
  }

  if (metadataSearch) {
    opts.metadataSearch = metadataSearch
  }

  if (events) {
    opts.events = events
  }

  if (userIds) {
    opts.userIds = userIds
  }

  if (appIds) {
    opts.appIds = appIds
  }

  return opts
}

export const buildAuditLogsEndpoints = API => ({
  /**
   * Gets a list of users in the current tenant.
   */
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

  downloadLogs: async opts => {
    return await API.post({
      url: `/api/global/auditlogs/definitions`,
      body: buildOpts(opts),
    })
  },
})
