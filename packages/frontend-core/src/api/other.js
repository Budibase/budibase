export const buildOtherEndpoints = API => ({
  /**
   * TODO: find out what this is
   */
  checkImportComplete: async () => {
    return await API.get({
      url: "/api/cloud/import/complete",
    })
  },

  /**
   * Gets the current environment details.
   */
  getEnvironment: async () => {
    return await API.get({
      url: "/api/system/environment",
    })
  },

  /**
   * Gets the current system status.
   */
  getSystemStatus: async () => {
    return await API.get({
      url: "/api/system/status",
    })
  },

  /**
   * Gets the list of available integrations.
   */
  getIntegrations: async () => {
    return await API.get({
      url: "/api/integrations",
    })
  },

  /**
   * Gets the version of the installed Budibase environment.
   */
  getBudibaseVersion: async () => {
    return (
      await API.get({
        url: "/api/dev/version",
      })
    ).version
  },

  /**
   * Gets the base permissions for roles.
   */
  getBasePermissions: async () => {
    return await API.get({
      url: "/api/permission/builtin",
    })
  },
})
