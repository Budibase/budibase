// todo: audit
export const buildAnalyticsEndpoints = API => ({
  /**
   * Gets the current status of analytics for this environment
   */
  getAnalyticsStatus: async () => {
    return await API.get({
      url: "/api/bbtel",
    })
  },
})
