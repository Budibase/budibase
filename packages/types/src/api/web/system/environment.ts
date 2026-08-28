export interface PasswordPolicy {
  minLength: number
  maxLength: number
  regex?: string
  regexErrorMessage?: string
}

export interface GetEnvironmentResponse {
  multiTenancy: boolean
  offlineMode: boolean
  cloud: boolean
  accountPortalUrl?: string
  disableAccountPortal: boolean
  baseUrl?: string
  isDev: boolean
  maintenance: { type: string }[]
  passwordPolicy: PasswordPolicy
}
