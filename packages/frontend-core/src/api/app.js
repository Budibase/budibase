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
  deployAppChanges: async () => {
    return await API.post({
      url: "/api/deploy",
    })
  },

  /**
   * Reverts an app to a previous version.
   * @param appId the app ID to revert
   */
  revertAppChanges: async appId => {
    return await API.post({
      url: `/api/dev/${appId}/revert`,
    })
  },

  /**
   * Updates an app's version of the client library.
   * @param appId the app ID to update
   */
  updateAppClientVersion: async appId => {
    return await API.post({
      url: `/api/applications/${appId}/client/update`,
    })
  },

  /**
   * Reverts an app's version of the client library to the previous version.
   * @param appId the app ID to revert
   */
  revertAppClientVersion: async appId => {
    return await API.post({
      url: `/api/applications/${appId}/client/revert`,
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

  /**
   * Creates an app.
   * @param app the app to create
   */
  createApp: async app => {
    return await API.post({
      url: "/api/applications",
      body: app,
    })
  },

  /**
   * Imports an export of all apps.
   * @param apps the FormData containing the apps to import
   */
  importApps: async apps => {
    return await API.post({
      url: "/api/cloud/import",
      body: apps,
      json: false,
    })
  },

  /**
   * Unpublishes a published app.
   * @param appId the production ID of the app to unpublish
   */
  unpublishApp: async appId => {
    return await API.delete({
      url: `/api/applications/${appId}?unpublish=1`,
    })
  },

  /**
   * Deletes a dev app.
   * @param appId the dev app ID to delete
   */
  deleteApp: async appId => {
    return await API.delete({
      url: `/api/applications/${appId}`,
    })
  },

  /**
   * Releases the lock on a dev app.
   * @param appId the dev app ID to unlock
   */
  releaseAppLock: async appId => {
    return await API.delete({
      url: `/api/dev/${appId}/lock`,
    })
  },

  /**
   * Syncs an app with the production database.
   * @param appId the ID of the app to sync
   */
  syncApp: async appId => {
    return await API.post({
      url: `/api/applications/${appId}/sync`,
    })
  },
})
