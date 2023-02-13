export interface APIError {
  message: string
  status: number
  error?: any
  validationErrors?: any
}
