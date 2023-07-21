export const buildLogsEndpoints = API => ({
  /**
   * Gets a stream for the system logs.
   */
  getSystemLogs: async () => {
    return await API.get({
      url: "/api/system/logs",
      json: false,
      parseResponse: async response => {
        return response
      },
    })
  },
})
