export interface PageRequest {
  page: number
  bookmark?: string
}

export interface LoadOptions {
  request?: PageRequest
  // Refresh without a loading state, preserving current data if the request fails.
  background?: boolean
}
