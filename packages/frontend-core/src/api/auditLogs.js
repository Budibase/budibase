const buildOpts = ({
  bookmark,
  userIds,
  appIds,
  startDate,
  endDate,
  fullSearch,
  events,
}) => {
  const opts = {}

  if (bookmark) {
    opts.bookmark = bookmark
  }

  if (startDate && endDate) {
    opts.startDate = startDate
    opts.endDate = endDate
  } else if (startDate && !endDate) {
    opts.startDate = startDate
  }

  if (fullSearch) {
    opts.fullSearch = fullSearch
  }

  if (events.length) {
    opts.events = events
  }

  if (userIds.length) {
    opts.userIds = userIds
  }

  if (appIds.length) {
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

  getDownloadUrl: opts => {
    const query = encodeURIComponent(JSON.stringify(opts))
    return `/api/global/auditlogs/download?query=${query}`
  },
})
