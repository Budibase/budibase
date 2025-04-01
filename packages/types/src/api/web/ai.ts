import { EnrichedBinding } from "../../ui"

export interface GenerateJsRequest {
  prompt: string
  bindings?: EnrichedBinding[]
}

export interface GenerateJsResponse {
  code: string
}

export interface GenerateTablesRequest {
  prompt: string
  addData: boolean
  useCached: boolean
}

export interface GenerateTablesResponse {
  createdTables: { id: string; name: string }[]
}
