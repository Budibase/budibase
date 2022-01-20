export const buildAnalyticsEndpoints = API => ({
  /**
   * Notifies that an end user client app has been loaded.
   */
  pingEndUser: async () => {
    return await API.post({
      url: `/api/analytics/ping`,
    })
  },
})
