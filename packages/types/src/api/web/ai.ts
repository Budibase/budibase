import { EnrichedBinding } from "../../ui"

export interface Message {
  role: "system" | "user"
  content: string
}

export interface ChatCompletionRequest {
  messages: Message[]
}

export interface ChatCompletionResponse {
  message?: string
}

export interface GenerateJsRequest {
  prompt: string
  bindings?: EnrichedBinding[]
}

export interface GenerateJsResponse {
  code: string
}

export interface GenerateCronRequest {
  prompt: string
}

export interface GenerateCronResponse {
  message?: string
}

export interface GenerateTablesRequest {
  prompt: string
  addData: boolean
  useCached: boolean
}

export interface GenerateTablesResponse {
  createdTables: { id: string; name: string }[]
}
