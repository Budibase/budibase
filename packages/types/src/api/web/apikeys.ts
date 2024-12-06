export type ApiKeyFetchResponse = Record<string, string>

export interface UpdateApiKeyRequest {
  value: string
}

export interface UpdateApiKeyResponse {
  _id: string
  _rev: string
}
