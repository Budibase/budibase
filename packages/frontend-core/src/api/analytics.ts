import { BaseAPIClient } from "./types"

type AnalyticsPingRequest = {
  source?: string
  embedded?: boolean
}

export interface AnalyticsEndpoints {
  getAnalyticsStatus: () => Promise<{ enabled: boolean }>
  analyticsPing: (payload: AnalyticsPingRequest) => Promise<void>
}

export const buildAnalyticsEndpoints = (
  API: BaseAPIClient
): AnalyticsEndpoints => ({
  /**
   * Gets the current status of analytics for this environment
   */
  getAnalyticsStatus: async () => {
    return await API.get({
      url: "/api/bbtel",
    })
  },
  /**
   * Notifies analytics of a certain environment
   */
  analyticsPing: async (payload: AnalyticsPingRequest) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return await API.post({
      url: "/api/bbtel/ping",
      body: { source: payload.source, embedded: payload.embedded, timezone },
    })
  },
})
