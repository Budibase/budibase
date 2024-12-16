export enum PingSource {
  BUILDER = "builder",
  APP = "app",
}

export interface AnalyticsEnabledResponse {
  enabled: boolean
}

export interface AnalyticsPingRequest {
  source: PingSource
  timezone: string
  embedded?: boolean
}
export interface AnalyticsPingResponse {
  message: string
  source?: PingSource
}
