import { WebSearchProvider } from "@budibase/types"

export interface WebSearchConfigResponse {
  _id: string
  _rev: string
  provider: WebSearchProvider
  apiKey: string
  enabled: boolean
}

export interface GetWebSearchConfigResponse {
  config: WebSearchConfigResponse | null
}

export interface SaveWebSearchConfigRequest {
  provider: WebSearchProvider
  apiKey: string
  enabled: boolean
}

export interface SaveWebSearchConfigResponse {
  config: WebSearchConfigResponse
}
