import { ToolSourceType } from "../documents"

export interface ToolSourceOption {
  name: string
  type: ToolSourceType
  description: string
}

/**
 * types for agent output - AgentOutputViewer.svelte
 */
export interface ViewerToolCall {
  toolCallId: string
  toolName: string
  input: unknown
}

export interface ViewerToolResult {
  toolCallId: string
  output?: unknown
}

export interface ViewerReasoningOutput {
  text: string
}

// Content part with type discriminator (from AI SDK StepResult.content)
export type ContentPart =
  | ({ type: "tool-call" } & ViewerToolCall)
  | ({ type: "tool-result" } & ViewerToolResult)
  | ({ type: "reasoning" } & ViewerReasoningOutput)
  | { type: "text"; text: string }

export interface ToolCallDisplay {
  toolCallId: string
  toolName: string
  displayName: string
  input: unknown
  output?: unknown
  status: "completed" | "failed" | "error"
}
