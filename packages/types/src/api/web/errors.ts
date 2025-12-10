export interface APIError {
  message: string
  status: number
  error?: any
  validationErrors?: any
}

export enum ErrorCode {
  HTTP = "http",
}
