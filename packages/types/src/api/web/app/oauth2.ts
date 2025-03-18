export interface OAuth2ConfigResponse {
  id: string
  name: string
}

export interface FetchOAuth2ConfigsResponse {
  configs: OAuth2ConfigResponse[]
}

export interface CreateOAuth2ConfigRequest {
  name: string
  url: string
  clientId: string
  clientSecret: string
}

export interface CreateOAuth2ConfigResponse {
  config: OAuth2ConfigResponse
}
