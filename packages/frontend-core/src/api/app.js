export const buildAppEndpoints = API => ({
  /**
   * Fetches screen definition for an app.
   */
  fetchAppPackage: async appId => {
    return await API.get({
      url: `/api/applications/${appId}/appPackage`,
    })
  },

  /**
   * Saves and patches metadata about an app.
   * @param metadata the app metadata to save
   */
  saveAppMetadata: async metadata => {
    if (!metadata?.appId) {
      throw API.error("App metadata must have an appId set")
    }
    return await API.put({
      url: `/api/applications/${metadata.appId}`,
      body: metadata,
    })
  },

  /**
   * Deploys the current app.
   */
  deployApp: async () => {
    return await API.post({
      url: "/api/deploy",
    })
  },

  /**
   * Reverts an app to a previous version.
   * @param appId the app ID to revert
   */
  revertApp: async appId => {
    return await API.post({
      url: `/api/dev/${appId}/revert`,
    })
  },

  /**
   * Gets a list of app deployments.
   */
  getAppDeployments: async () => {
    return await API.get({
      url: "/api/deployments",
    })
  },
})
