export type ApiKeyFetchResponse = Record<string, string>

export interface ApiKeyUpdateRequest {
  value: string
}

export interface ApiKeyUpdateResponse {
  _id: string
  _rev: string
}
