import {
  OAuth2AuthType,
  OAuth2CredentialsMethod,
  OAuth2GrantType,
} from "../documents/workspace/oauth2"

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
