export const buildLogsEndpoints = API => ({
  /**
   * Gets a list of datasources.
   */
  getServerLogs: async () => {
    return await API.get({
      url: "/api/global/system/logs",
      json: false,
      parseResponse: async response => {
        return response
      },
    })
  },
})
