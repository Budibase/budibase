import { EnrichedBinding } from "../../ui"

export interface GenerateJsRequest {
  prompt: string
  bindings?: EnrichedBinding[]
}

export interface GenerateJsResponse {
  code: string
}
