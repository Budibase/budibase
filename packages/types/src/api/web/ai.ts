import { EnrichedBinding } from "../../ui"

export interface Message {
  role: "system" | "user"
  content: string
}

export enum StructuredOutput {}

export type ResponseFormat = "text" | "json" | StructuredOutput

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
