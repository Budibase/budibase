export const buildAnalyticsEndpoints = API => ({
  /**
   * Notifies that an end user client app has been loaded.
   */
  pingEndUser: async () => {
    return await API.post({
      url: `/api/analytics/ping`,
    })
  },

  /**
   * Gets the current status of analytics for this environment
   */
  getAnalyticsStatus: async () => {
    return await API.get({
      url: "/api/analytics",
    })
  },
})
