import { BaseAPIClient } from "./types"

export interface LogEndpoints {
  getSystemLogs: () => Promise<any>
}

export const buildLogsEndpoints = (API: BaseAPIClient): LogEndpoints => ({
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
