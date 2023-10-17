export const buildAnalyticsEndpoints = API => ({
  /**
   * Gets the current status of analytics for this environment
   */
  getAnalyticsStatus: async () => {
    return await API.get({
      url: "/api/bbtel",
    })
  },
  analyticsPing: async ({ source, embedded }) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return await API.post({
      url: "/api/bbtel/ping",
      body: { source, timezone, embedded },
    })
  },
})
