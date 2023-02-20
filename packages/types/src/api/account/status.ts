export interface HealthStatusResponse {
  passing: boolean
  checks: {
    login: boolean
    search: boolean
  }
}
