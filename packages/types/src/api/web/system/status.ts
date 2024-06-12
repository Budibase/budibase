export type SystemStatusResponse = {
  passing?: boolean
  checks?: {
    login: boolean
    search: boolean
  }
  health?: {
    passing: boolean
  }
  version?: string
}
