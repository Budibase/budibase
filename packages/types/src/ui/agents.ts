import type { StepResult, ToolSet } from "ai"
import { ToolMetadata } from "../documents"

export type AgentStepResult<TOOLS extends ToolSet = ToolSet> = StepResult<TOOLS>

export type ContentPart<TOOLS extends ToolSet = ToolSet> =
  AgentStepResult<TOOLS>["content"][number]

export type ViewerToolCall<TOOLS extends ToolSet = ToolSet> = Extract<
  ContentPart<TOOLS>,
  { type: "tool-call" }
>

export type ViewerToolResult<TOOLS extends ToolSet = ToolSet> = Extract<
  ContentPart<TOOLS>,
  { type: "tool-result" }
>

export interface ToolCallDisplay<TOOLS extends ToolSet = ToolSet> {
  toolCallId: ViewerToolCall<TOOLS>["toolCallId"]
  toolName: ViewerToolCall<TOOLS>["toolName"]
  displayName: string
  input: ViewerToolCall<TOOLS>["input"]
  output?: ViewerToolResult<TOOLS>["output"]
  status: "completed" | "failed" | "error" | "pending"
}

export interface EnrichedTool extends ToolMetadata {
  readableBinding: string
  runtimeBinding: string
  icon?: { url?: string; icon?: any }
}
