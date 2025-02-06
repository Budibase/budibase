export interface StatusEnvironmentVariableResponse {
  encryptionKeyAvailable: boolean
}

export interface CreateEnvironmentVariableRequest {
  name: string
  production: string
  development: string
}
export interface CreateEnvironmentVariableResponse {
  message: string
}

export interface UpdateEnvironmentVariableRequest {
  production: string
  development: string
}
export interface UpdateEnvironmentVariableResponse {
  message: string
}

export interface GetEnvironmentVariablesResponse {
  variables: string[]
}

export interface DeleteEnvironmentVariablesResponse {
  message: string
}
