interface OAuth2Config {
  id: string
  name: string
  url: string
}

export interface FetchOAuth2ConfigsResponse {
  configs: OAuth2Config[]
}

export interface CreateOAuth2ConfigRequest extends Omit<OAuth2Config, "id"> {}

export interface CreateOAuth2ConfigResponse {
  config: OAuth2Config
}
