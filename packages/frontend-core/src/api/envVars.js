export const buildEnvironmentVariableEndpoints = API => ({
  /**
   * Fetches a list of environment variables
   */
  fetchEnvVars: async () => {
    return await API.get({
      url: `/api/env/variables`,
      json: false,
    })
  },
})
