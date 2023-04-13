export interface GetEnvironmentResponse {
  multiTenancy: boolean
  cloud: boolean
  accountPortalUrl: string
  baseUrl: string
  disableAccountPortal: boolean
  isDev: boolean
}
