export const buildEnvironmentVariableEndpoints = API => ({
  /**
   * Fetches a list of environment variables
   */
  fetchVariables: async () => {
    return await API.get({
      url: `/api/env/variables`,
      json: false,
    })
  },

  createVariable: async () => {
    return await API.get({
      url: `/api/env/variables`,
      json: false,
    })
  },
})
