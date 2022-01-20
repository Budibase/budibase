export const buildAppEndpoints = API => ({
  /**
   * Fetches screen definition for an app.
   */
  fetchAppPackage: async appId => {
    return await API.get({
      url: `/api/applications/${appId}/appPackage`,
    })
  },
})
