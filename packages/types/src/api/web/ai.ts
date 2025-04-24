import openai from "openai"
import { EnrichedBinding } from "../../ui"

export interface Message {
  role: "system" | "user"
  content: string
}

export type ResponseFormat = "text" | "json" | openai.ResponseFormatJSONSchema

export interface ChatCompletionRequest {
  messages: Message[]
  format?: ResponseFormat
}

export interface ChatCompletionResponse {
  message?: string
  tokensUsed?: number
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
}

export interface GenerateTablesResponse {
  createdTables: { id: string; name: string }[]
}
