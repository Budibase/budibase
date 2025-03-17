export interface OAuth2ConfigResponse {
  id: string
  name: string
}

export interface FetchOAuth2ConfigsResponse {
  configs: OAuth2ConfigResponse[]
}

export interface UpsertOAuth2ConfigRequest {
  name: string
  url: string
  clientId: string
  clientSecret: string
}

export interface UpsertOAuth2ConfigResponse {
  config: OAuth2ConfigResponse
}
