import {
  type EscalationRecipient,
  PermissionLevel,
  PermissionType,
  ToolExecutionPrincipal,
  ToolType,
  type AgentExecutionContext,
} from "@budibase/types"
import { type ModelMessage, type Tool, type ToolSet } from "ai"

export interface ToolAuthorization {
  supportedPrincipals: ToolExecutionPrincipal[]
  permissionType: PermissionType
  permissionLevel: PermissionLevel
  resourceId?: string
  resolveResourceId?: (input: unknown) => string | undefined
  prepareInput?: (
    modelInput: unknown,
    executionContext: AgentExecutionContext
  ) => unknown | Promise<unknown>
}

export interface ToolApprovalSummary {
  title: string
  summary: string
}

export interface ToolApproval {
  summarize: (
    input: unknown,
    executionContext: AgentExecutionContext
  ) => ToolApprovalSummary | Promise<ToolApprovalSummary>
}

export interface AiToolDefinition {
  name: string
  readableName?: string
  description: string
  tool: Tool
  sourceType: ToolType
  sourceLabel?: string
  sourceIconType?: string
  authorization?: ToolAuthorization
  approval?: ToolApproval
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
  escalation?: {
    recipient: EscalationRecipient
    request: (params: {
      input: unknown
      summary: ToolApprovalSummary
      toolCallId: string
      messages: ModelMessage[]
    }) => Promise<{ escalationId: string }>
  }
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
    let preparedInput = args[0]
    if (runtime) {
      if (!toolDef.authorization) {
        throw new Error("Tool is not available in this security context")
      }
      if (
        !toolDef.authorization.supportedPrincipals.includes(runtime.principal)
      ) {
        throw new Error("Tool is not available in this security context")
      }
      preparedInput = toolDef.authorization.prepareInput
        ? await toolDef.authorization.prepareInput(
            args[0],
            runtime.executionContext
          )
        : args[0]
      await runtime.authorize({
        authorization: toolDef.authorization,
        input: preparedInput,
        executionContext: runtime.executionContext,
        principal: runtime.principal,
      })
      if (runtime.escalation) {
        if (!toolDef.approval) {
          throw new Error("Tool does not support approval gates")
        }
        const summary = await toolDef.approval.summarize(
          preparedInput,
          runtime.executionContext
        )
        const { escalationId } = await runtime.escalation.request({
          input: preparedInput,
          summary,
          toolCallId: args[1].toolCallId,
          messages: args[1].messages,
        })
        return {
          status: "pending_approval",
          escalationId,
          title: summary.title,
          summary: summary.summary,
          note: "This tool call is waiting for human approval.",
        }
      }
    }
    try {
      const result = await execute(preparedInput, args[1])
      const failureMessage = getToolFailure(result)
      if (failureMessage) {
        throw new Error(failureMessage)
      }
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
      return result
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
