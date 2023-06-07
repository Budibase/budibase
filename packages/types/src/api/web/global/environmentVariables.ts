export interface StatusEnvironmentVariableResponse {
  encryptionKeyAvailable: boolean
}

export interface CreateEnvironmentVariableRequest {
  name: string
  production: string
  development: string
}

export interface UpdateEnvironmentVariableRequest {
  production: string
  development: string
}

export interface GetEnvironmentVariablesResponse {
  variables: string[]
}
