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
})
