export const buildEnvironmentVariableEndpoints = API => ({
  checkEnvironmentVariableStatus: async () => {
    return await API.get({
      url: `/api/env/variables/status`,
    })
  },

  /**
   * Fetches a list of environment variables
   */
  fetchEnvironmentVariables: async () => {
    return await API.get({
      url: `/api/env/variables`,
      json: false,
    })
  },

  createEnvironmentVariable: async data => {
    return await API.post({
      url: `/api/env/variables`,
      body: data,
    })
  },
  deleteEnvironmentVariable: async varName => {
    return await API.delete({
      url: `/api/env/variables/${varName}`,
    })
  },

  updateEnvironmentVariable: async data => {
    return await API.patch({
      url: `/api/env/variables/${data.name}`,
      body: data,
    })
  },
})
