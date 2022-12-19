export const buildHostingEndpoints = API => ({
  /**
   * Gets the hosting URLs of the environment.
   */
  getHostingURLs: async () => {
    return await API.get({
      url: "/api/hosting/urls",
    })
  },

  /**
   * Gets the list of deployed apps.
   */
  getDeployedApps: async () => {
    return await API.get({
      url: "/api/hosting/apps",
    })
  },
})
