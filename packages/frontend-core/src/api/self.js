export const buildSelfEndpoints = API => ({
  /**
   * Using the logged in user, this will generate a new API key,
   * assuming the user is a builder.
   * @return {Promise<object>} returns the API response, including an API key.
   */
  generateAPIKey: async () => {
    return await API.post({
      url: "/api/global/self/api_key",
    })
  },

  /**
   * retrieves the API key for the logged in user.
   * @return {Promise<object>} An object containing the user developer information.
   */
  fetchDeveloperInfo: async () => {
    return await API.get({
      url: "/api/global/self/api_key",
    })
  },
})
