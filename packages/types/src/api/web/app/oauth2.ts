interface OAuth2Config {}

export interface FetchOAuth2ConfigsResponse {
  configs: OAuth2Config[]
}

export interface CreateOAuth2ConfigRequest {}

export interface CreateOAuth2ConfigResponse {
  config: OAuth2Config
}
