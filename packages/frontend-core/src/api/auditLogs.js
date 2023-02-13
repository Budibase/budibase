const buildOpts = ({
  userIds,
  appIds,
  startDate,
  endDate,
  metadataSearch,
  event,
}) => {
  const opts = {}

  if (startDate && endDate) {
    opts.startDate = startDate
    opts.endDate = endDate
  }

  if (metadataSearch) {
    opts.metadataSearch = metadataSearch
  }

  if (event) {
    opts.event = event
  }

  if (userIds) {
    opts.userId = userIds
  }

  if (appIds) {
    opts.appId = appIds
  }

  return opts
}

export const buildAuditLogsEndpoints = API => ({
  /**
   * Gets a list of users in the current tenant.
   */
  searchAuditLogs: async opts => {
    return await API.post({
      url: `/api/auditlogs/search`,
      body: buildOpts(opts),
    })
  },

  getEventDefinitions: async () => {
    return await API.get({
      url: `/api/auditlogs/definitions`,
    })
  },

  downloadLogs: async opts => {
    return await API.post({
      url: `/api/auditlogs/definitions`,
      body: buildOpts(opts),
    })
  },
})
