import { OAuth2CredentialsMethod } from "@budibase/types"

export interface OAuth2ConfigResponse {
  id: string
  name: string
  url: string
  clientId: string
  clientSecret: string
  method: OAuth2CredentialsMethod
}

export interface FetchOAuth2ConfigsResponse {
  configs: OAuth2ConfigResponse[]
}

export interface UpsertOAuth2ConfigRequest {
  name: string
  url: string
  clientId: string
  clientSecret: string
  method: OAuth2CredentialsMethod
}

export interface UpsertOAuth2ConfigResponse {
  config: OAuth2ConfigResponse
}

export interface ValidateConfigRequest {
  id?: string
  url: string
  clientId: string
  clientSecret: string
  method: OAuth2CredentialsMethod
}

export interface ValidateConfigResponse {
  valid: boolean
  message?: string
}
