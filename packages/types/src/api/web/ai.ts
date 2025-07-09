import openai from "openai"
import { EnrichedBinding } from "../../ui"
import { z } from "zod"

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

export type Tool<T extends z.ZodType = z.ZodType> = Required<ToolArgs<T>>

export interface ToolArgs<T extends z.ZodType> {
  name: string
  description: string
  parameters?: T
  handler: (args: z.infer<T>) => Promise<string>
  strict?: boolean
}

export function newTool<T extends z.ZodType>(tool: ToolArgs<T>): Tool<T> {
  // Create error-aware handler that logs failures to server logs
  const errorAwareHandler = async (args: z.infer<T>): Promise<string> => {
    console.debug(`[TOOL DEBUG] Executing tool: ${tool.name}`)
    try {
      const result = await tool.handler(args)
      console.debug(`[TOOL DEBUG] Tool ${tool.name} succeeded`)
      return result
    } catch (error: any) {
      console.error(`[TOOL ERROR] Tool '${tool.name}' failed:`, error)

      // Still return the error message for the Agent
      return `Error executing ${tool.name}: ${error.message}`
    }
  }

  return {
    strict: tool.strict ?? true,
    parameters: tool.parameters ?? (z.object({}) as unknown as T),
    description: tool.description,
    handler: errorAwareHandler,
    name: tool.name,
  }
}

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
