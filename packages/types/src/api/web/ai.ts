import { EnrichedBinding } from "../../ui"
import type { z } from "zod"

export interface ChatCompletionContentPartText {
  type: "text"
  text: string
}

export interface ChatCompletionContentPartImageUrl {
  type: "image_url"
  image_url: {
    url: string
  }
}

export type ChatCompletionContentPart =
  | ChatCompletionContentPartText
  | ChatCompletionContentPartImageUrl
  | {
      type: string
      [key: string]: unknown
    }

export type UserContent = string | ChatCompletionContentPart[]

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
  tool_calls?: ChatCompletionMessageToolCall[]
}

export interface ToolMessage {
  role: "tool"
  tool_call_id: string
  content: string
}

export interface ChatCompletionMessageToolCallFunction {
  name: string
  arguments: string
}

export interface ChatCompletionMessageToolCall {
  id: string
  type: "function"
  function: ChatCompletionMessageToolCallFunction
}

export type Message =
  | SystemMessage
  | UserMessage
  | AssistantMessage
  | ToolMessage

export type Tool<T extends z.ZodType = z.ZodType> = Required<ToolArgs<T>>

export interface ToolArgs<T extends z.ZodType> {
  name: string
  description: string
  parameters?: T
  handler: (args: z.infer<T>) => Promise<string>
  strict?: boolean
}

export interface ResponseFormatJSONSchema {
  type: "json_schema"
  json_schema: {
    schema: Record<string, unknown>
    name?: string
    description?: string
  }
  name?: string
  description?: string
}

export type ResponseFormat = "text" | "json" | ResponseFormatJSONSchema

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
