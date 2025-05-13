export interface APIError {
  message: string
  status: number
  error?: any
  validationErrors?: any
}

export enum ErrorCode {
  USAGE_LIMIT_EXCEEDED = "usage_limit_exceeded",
  FEATURE_DISABLED = "feature_disabled",
  INVALID_API_KEY = "invalid_api_key",
  HTTP = "http",
}
