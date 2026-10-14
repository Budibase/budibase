export interface APIWarning {
  message: string
  status: number
}

export enum APIWarningCode {
  USAGE_LIMIT_EXCEEDED = "usage_limit_exceeded",
  FEATURE_DISABLED = "feature_disabled",
  INVALID_API_KEY = "invalid_api_key",
}
