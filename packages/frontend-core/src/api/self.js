export const buildSelfEndpoints = API => ({
  /**
   * Using the logged in user, this will generate a new API key,
   * assuming the user is a builder.
   * @return {Promise<object>} returns the API response, including an API key.
   */
  generateAPIKey: async () => {
    const response = await API.post({
      url: "/api/global/self/api_key",
    })
    return response?.apiKey
  },

  /**
   * retrieves the API key for the logged in user.
   * @return {Promise<object>} An object containing the user developer information.
   */
  fetchDeveloperInfo: async () => {
    return API.get({
      url: "/api/global/self/api_key",
    })
  },

  /**
   * Fetches the currently logged-in user object.
   * Used in client apps.
   */
  fetchSelf: async () => {
    return await API.get({
      url: "/api/self",
    })
  },

  /**
   * Fetches the currently logged-in user object.
   * Used in the builder.
   */
  fetchBuilderSelf: async () => {
    return await API.get({
      url: "/api/global/self",
    })
  },

  /**
   * Updates the current logged-in user.
   * @param user the new user object to save
   */
  updateSelf: async user => {
    return await API.post({
      url: "/api/global/self",
      body: user,
    })
  },
})
