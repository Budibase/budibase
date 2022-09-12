export const buildPluginEndpoints = API => ({
  /**
   * Uploads a plugin tarball bundle
   * @param data the plugin tarball bundle to upload
   */
  uploadPlugin: async data => {
    return await API.post({
      url: "/api/plugin/upload",
      body: data,
      json: false,
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
})
