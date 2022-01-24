export const buildBuilderEndpoints = API => ({
  /**
   * Fetches the definitions for component library components. This includes
   * their props and other metadata from components.json.
   * @param {string} appId - ID of the currently running app
   */
  fetchComponentLibDefinitions: async appId => {
    return await API.get({
      url: `/api/${appId}/components/definitions`,
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
    return await API.get({
      url: "/api/dev/version",
    })
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
