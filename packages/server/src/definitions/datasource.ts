/********************************************
 * This file contains structures which are  *
 * internal to the server and don't need to *
 * be exposed for use by other services.    *
 ********************************************/

export interface QueryOptions {
  disableReturning?: boolean
}

export enum AuthType {
  BASIC = "basic",
  BEARER = "bearer",
}

interface AuthConfig {
  _id: string
  name: string
  type: AuthType
  config: BasicAuthConfig | BearerAuthConfig
}

export interface BasicAuthConfig {
  username: string
  password: string
}

export interface BearerAuthConfig {
  token: string
}

export interface RestConfig {
  url: string
  rejectUnauthorized: boolean
  defaultHeaders: {
    [key: string]: any
  }
  legacyHttpParser: boolean
  authConfigs: AuthConfig[]
  staticVariables: {
    [key: string]: string
  }
  dynamicVariables: [
    {
      name: string
      queryId: string
      value: string
    }
  ]
}
