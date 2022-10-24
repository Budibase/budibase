export const buildPluginEndpoints = API => ({
  /**
   * Uploads a plugin tarball bundle
   * @param data the plugin tarball bundle to upload
   */
  uploadPlugin: async data => {
    return await API.post({
      url: `/api/plugin/upload`,
      body: data,
      json: false,
    })
  },

  /**
   * Creates a plugin from URL, Github or NPM
   */
  createPlugin: async data => {
    return await API.post({
      url: `/api/plugin`,
      body: data,
    })
  },

  /**
   * Gets a list of all plugins
   */
  getPlugins: async () => {
    return await API.get({
      url: "/api/plugin",
    })
  },

  /**
   * Deletes a plugin.
   * @param pluginId the ID of the plugin to delete
   *
   * * @param pluginId the revision of the plugin to delete
   */
  deletePlugin: async pluginId => {
    return await API.delete({
      url: `/api/plugin/${pluginId}`,
    })
  },
})
