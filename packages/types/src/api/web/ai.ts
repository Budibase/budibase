import { EnrichedBinding } from "../../ui"
import { ModelMessage, UserContent as AIUserContent } from "ai"
import type z from "zod"

export type UserContent = string | AIUserContent

export type Message = ModelMessage

export type ResponseFormat = "text" | "json" | z.ZodObject

export interface ChatCompletionRequestV2 {
  messages: ModelMessage[]
  model: string
  stream?: boolean
}

export interface ChatCompletionRequest {
  messages: Message[]
  format?: ResponseFormat
}

export interface ChatCompletionResponse {
  messages: Message[]
  tokensUsed: number
}

export interface AIQuotaUsageResponse {
  monthlyCredits: number
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

export interface UploadFileRequest {
  data: string
  filename: string
  contentType: string
}

export interface UploadFileResponse {
  file: string
}
