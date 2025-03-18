interface OAuth2Config {
  name: string
}

export interface FetchOAuth2ConfigsResponse {
  configs: OAuth2Config[]
}

export interface CreateOAuth2ConfigRequest extends OAuth2Config {}
