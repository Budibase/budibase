import { OAuth2CredentialsMethod, OAuth2GrantType } from "@budibase/types"

export interface OAuth2ConfigResponse {
  _id: string
  _rev: string
  name: string
  url: string
  clientId: string
  clientSecret: string
  method: OAuth2CredentialsMethod
  grantType: OAuth2GrantType
  scope?: string
}

export interface FetchOAuth2ConfigsResponse {
  configs: (OAuth2ConfigResponse & { lastUsage?: string })[]
}

export interface InsertOAuth2ConfigRequest {
  name: string
  url: string
  clientId: string
  clientSecret: string
  method: OAuth2CredentialsMethod
  grantType: OAuth2GrantType
  scope?: string
}

export interface InsertOAuth2ConfigResponse {
  config: OAuth2ConfigResponse
}

export interface UpdateOAuth2ConfigRequest {
  _id: string
  _rev: string
  name: string
  url: string
  clientId: string
  clientSecret: string
  method: OAuth2CredentialsMethod
  grantType: OAuth2GrantType
  scope?: string
}

export interface UpdateOAuth2ConfigResponse {
  config: OAuth2ConfigResponse
}

export interface ValidateConfigRequest {
  _id?: string
  url: string
  clientId: string
  clientSecret: string
  method: OAuth2CredentialsMethod
  grantType: OAuth2GrantType
  scope?: string
}

export interface ValidateConfigResponse {
  valid: boolean
  message?: string
}
