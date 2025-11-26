import openai from "openai"
import { EnrichedBinding } from "../../ui"
import type { z } from "zod"

export type UserContent = string | openai.ChatCompletionContentPart[]

export interface SystemMessage {
  role: "system"
  content: string
}

export interface UserMessage {
  role: "user"
  content: UserContent
}

export interface AssistantMessage {
  role: "assistant"
  content: string | null
  tool_calls?: openai.ChatCompletionMessageToolCall[]
}

export interface ToolMessage {
  role: "tool"
  tool_call_id: string
  content: string
}

export type Message =
  | SystemMessage
  | UserMessage
  | AssistantMessage
  | ToolMessage

export interface ToolArgs<T extends z.ZodTypeAny = z.ZodTypeAny> {
  name: string
  description: string
  parameters?: T
  handler: (args: unknown) => Promise<string>
  strict?: boolean
}

export type Tool<T extends z.ZodTypeAny = z.ZodTypeAny> = Required<ToolArgs<T>>

export type ResponseFormat = "text" | "json" | openai.ResponseFormatJSONSchema

export interface ChatCompletionRequest {
  messages: Message[]
  format?: ResponseFormat
  useTools?: boolean
}

export interface ChatCompletionResponse {
  messages: Message[]
  tokensUsed: number
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
