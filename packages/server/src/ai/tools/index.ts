import {
  PermissionLevel,
  PermissionType,
  ToolExecutionPrincipal,
  ToolType,
  type AgentExecutionContext,
  type AgentOperationToolConfig,
  type ToolExecutionPolicy,
} from "@budibase/types"
import { type ModelMessage, type Tool, type ToolSet } from "ai"

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
  sourceId?: string
  description: string
  tool: Tool
  sourceType: ToolType
  sourceLabel?: string
  sourceIconType?: string
  executionPolicy: ToolExecutionPolicy
  authorization?: ToolAuthorization
  requesterRedactedTool?: Tool
  filterResult?: (
    result: unknown,
    runtime: ToolAuthorizationRuntime
  ) => Promise<unknown>
}

export interface ToolAuthorizationRuntime {
  executionContext: AgentExecutionContext
  principal: ToolExecutionPrincipal
  authorize: (params: ToolAuthorizationRequest) => Promise<void>
}

export interface ToolAuthorizationRequest {
  authorization: ToolAuthorization
  input: unknown
  executionContext: AgentExecutionContext
  principal: ToolExecutionPrincipal
}

export interface EscalationGateRuntime {
  intercept: (
    input: unknown,
    options: { toolCallId: string; messages?: ModelMessage[] }
  ) => Promise<Record<string, unknown>>
}

export const resolveToolExecutionPrincipal = (
  tool: AiToolDefinition,
  config?: AgentOperationToolConfig
) =>
  tool.executionPolicy.mode === "admin"
    ? ToolExecutionPrincipal.ADMIN
    : (config?.executionPrincipal ?? tool.executionPolicy.defaultPrincipal)

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

const logToolExecution = (
  outcome: "success" | "error",
  toolDef: AiToolDefinition,
  runtime: ToolAuthorizationRuntime
) =>
  console.log("Agent tool execution", {
    outcome,
    toolName: toolDef.name,
    requesterId: runtime.executionContext.requester.executorRole,
    effectivePrincipal: runtime.principal,
    agentId: runtime.executionContext.agentId,
    operationId: runtime.executionContext.operationId,
    conversationId: runtime.executionContext.conversationId,
  })

const wrapTool = (
  toolDef: AiToolDefinition,
  runtime?: ToolAuthorizationRuntime,
  gate?: EscalationGateRuntime
): Tool => {
  const execute = toolDef.tool.execute
  if (!execute) {
    return toolDef.tool
  }

  const wrappedExecute: NonNullable<Tool["execute"]> = async (
    input,
    options
  ) => {
    if (runtime) {
      if (!toolDef.authorization) {
        throw new Error("Tool is not available in this security context")
      }
      await runtime.authorize({
        authorization: toolDef.authorization,
        input,
        executionContext: runtime.executionContext,
        principal: runtime.principal,
      })
    }
    if (gate) {
      return await gate.intercept(input, {
        toolCallId: options?.toolCallId ?? "",
        messages: options?.messages,
      })
    }
    try {
      const result = await execute(input, options)
      const failureMessage = getToolFailure(result)
      if (failureMessage) {
        throw new Error(failureMessage)
      }
      const authorizedResult =
        runtime && toolDef.filterResult
          ? await toolDef.filterResult(result, runtime)
          : result
      if (runtime) {
        logToolExecution("success", toolDef, runtime)
      }
      return authorizedResult
    } catch (error) {
      if (runtime) {
        logToolExecution("error", toolDef, runtime)
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
  runtimes: Map<string, ToolAuthorizationRuntime> = new Map(),
  gates: Map<string, EscalationGateRuntime> = new Map()
): ToolSet => {
  return Object.fromEntries(
    tools.map(toolDef => [
      toolDef.name,
      wrapTool(toolDef, runtimes.get(toolDef.name), gates.get(toolDef.name)),
    ])
  )
}

export { default as budibase } from "./budibase"
export * from "./restQuery"
