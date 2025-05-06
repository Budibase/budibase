import { JSONSchema4 } from "json-schema"
import { EnrichedBinding } from "../../ui"

export interface Message {
  role: "system" | "user"
  content: string
}

export interface Tool {
  name: string
  description?: string
  parameters?: JSONSchema4
  // strictly follow JSON schema specified in parameters
  strict?: boolean
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
