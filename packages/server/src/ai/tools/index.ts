import { ToolType } from "@budibase/types"
import { type Tool, type ToolSet } from "ai"

export interface AiToolDefinition {
  name: string
  description: string
  tool: Tool
  sourceType: ToolType
  sourceLabel?: string
}

export const toToolSet = (tools: AiToolDefinition[]): ToolSet => {
  return Object.fromEntries(tools.map(toolDef => [toolDef.name, toolDef.tool]))
}

export { default as budibase } from "./budibase"
export * from "./restQuery"
