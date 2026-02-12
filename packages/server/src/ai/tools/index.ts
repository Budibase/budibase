import { ToolType } from "@budibase/types"
import { type Tool, type ToolSet } from "ai"

export interface AiToolDefinition {
  name: string
  readableName?: string
  description: string
  tool: Tool
  sourceType: ToolType
  sourceLabel?: string
  sourceIconType?: string
}

const getToolFailure = (result: unknown): string | undefined => {
  if (!result || typeof result !== "object" || !("error" in result)) {
    return
  }

  const { error } = result
  if (error == null || error === false) {
    return
  }

  if (error instanceof Error) {
    return error.message || "Tool execution failed"
  }

  return String(error)
}

const wrapTool = (toolDef: AiToolDefinition): Tool => {
  const execute = toolDef.tool.execute
  if (!execute) {
    return toolDef.tool
  }

  const wrappedExecute: NonNullable<Tool["execute"]> = async (...args) => {
    const result = await execute(...args)
    const failureMessage = getToolFailure(result)
    if (failureMessage) {
      throw new Error(failureMessage)
    }
    return result
  }

  return {
    ...toolDef.tool,
    execute: wrappedExecute,
  }
}

export const toToolSet = (tools: AiToolDefinition[]): ToolSet => {
  return Object.fromEntries(
    tools.map(toolDef => [toolDef.name, wrapTool(toolDef)])
  )
}

export { default as budibase } from "./budibase"
export * from "./restQuery"
