import { Document } from "../document"

export enum OAuth2CredentialsMethod {
  HEADER = "HEADER",
  BODY = "BODY",
}

export enum OAuth2GrantType {
  CLIENT_CREDENTIALS = "client_credentials",
}

export type OAuth2AuthType = "app_oauth" | "delegated_oauth"

export interface OAuth2Config extends Document {
  name: string
  url: string
  clientId: string
  clientSecret: string
  method: OAuth2CredentialsMethod
  grantType: OAuth2GrantType
  scope?: string
  audience?: string
}

export interface OAuth2TokenRequestConfig {
  _id?: string
  datasourceId?: string
  url: string
  clientId: string
  clientSecret: string
  method: OAuth2CredentialsMethod
  grantType: OAuth2GrantType
  authType?: OAuth2AuthType
  scope?: string
  audience?: string
}
