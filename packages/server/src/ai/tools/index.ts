import {
  PermissionLevel,
  PermissionType,
  ToolExecutionPrincipal,
  ToolType,
  type AgentExecutionContext,
} from "@budibase/types"
import { type Tool, type ToolSet } from "ai"

export interface ToolAuthorization {
  permissionType: PermissionType
  permissionLevel: PermissionLevel
  resourceId?: string
  resolveResourceId?: (input: unknown) => string | undefined
}

export interface AiToolDefinition {
  name: string
  readableName?: string
  tableId?: string
  description: string
  tool: Tool
  sourceType: ToolType
  sourceLabel?: string
  sourceIconType?: string
  authorization?: ToolAuthorization
  filterResult?: (
    result: unknown,
    runtime: ToolAuthorizationRuntime
  ) => Promise<unknown>
}

export interface ToolAuthorizationRuntime {
  executionContext: AgentExecutionContext
  principal: ToolExecutionPrincipal
  authorize: (params: {
    authorization: ToolAuthorization
    input: unknown
    executionContext: AgentExecutionContext
    principal: ToolExecutionPrincipal
  }) => Promise<void>
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

const wrapTool = (
  toolDef: AiToolDefinition,
  runtime?: ToolAuthorizationRuntime
): Tool => {
  const execute = toolDef.tool.execute
  if (!execute) {
    return toolDef.tool
  }

  const wrappedExecute: NonNullable<Tool["execute"]> = async (...args) => {
    if (runtime) {
      if (!toolDef.authorization) {
        throw new Error("Tool is not available in this security context")
      }
      await runtime.authorize({
        authorization: toolDef.authorization,
        input: args[0],
        executionContext: runtime.executionContext,
        principal: runtime.principal,
      })
    }
    try {
      const result = await execute(...args)
      const failureMessage = getToolFailure(result)
      if (failureMessage) {
        throw new Error(failureMessage)
      }
      const authorizedResult =
        runtime && toolDef.filterResult
          ? await toolDef.filterResult(result, runtime)
          : result
      if (runtime) {
        console.log("Agent tool execution", {
          outcome: "success",
          toolName: toolDef.name,
          requesterId: runtime.executionContext.requestingUserId,
          effectivePrincipal: runtime.principal,
          agentId: runtime.executionContext.agentId,
          operationId: runtime.executionContext.operationId,
          conversationId: runtime.executionContext.conversationId,
        })
      }
      return authorizedResult
    } catch (error) {
      if (runtime) {
        console.log("Agent tool execution", {
          outcome: "error",
          toolName: toolDef.name,
          requesterId: runtime.executionContext.requestingUserId,
          effectivePrincipal: runtime.principal,
          agentId: runtime.executionContext.agentId,
          operationId: runtime.executionContext.operationId,
          conversationId: runtime.executionContext.conversationId,
        })
      }
      throw error
    }
  }

  return {
    ...toolDef.tool,
    execute: wrappedExecute,
  }
}

export const toToolSet = (
  tools: AiToolDefinition[],
  runtimes: Map<string, ToolAuthorizationRuntime> = new Map()
): ToolSet => {
  return Object.fromEntries(
    tools.map(toolDef => [
      toolDef.name,
      wrapTool(toolDef, runtimes.get(toolDef.name)),
    ])
  )
}

export { default as budibase } from "./budibase"
export * from "./restQuery"
