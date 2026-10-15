import { validateTypes } from "@ai-sdk/provider-utils"
import { type ModelMessage, type Tool, type ToolSet } from "ai"
import { events, getErrorMessage } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import {
  ActionFailureReason,
  ActionType,
  PermissionLevel,
  PermissionType,
  ToolAction,
  ToolExecutionPrincipal,
  ToolType,
  type AgentExecutionContext,
  type AgentOperationToolConfig,
  type ToolExecutionPolicy,
} from "@budibase/types"

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
  action?: ToolAction
  executionPolicy: ToolExecutionPolicy
  authorization?: ToolAuthorization
  authoritativeInputSchema?: Tool["inputSchema"]
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
  // Resolves to the refusal result to return in place of executing, or
  // undefined when no rule matches and the call should proceed.
  intercept: (
    input: unknown,
    options: { toolCallId: string; messages?: ModelMessage[] }
  ) => Promise<Record<string, unknown> | undefined>
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

  return getErrorMessage(error) || "Tool execution failed"
}

const logToolExecution = (
  outcome: "success" | "error",
  toolDef: AiToolDefinition,
  runtime: ToolAuthorizationRuntime,
  error?: unknown
) =>
  console.log("Agent tool execution", {
    outcome,
    toolName: toolDef.name,
    requesterRole: runtime.executionContext.requester.executorRole,
    effectivePrincipal: runtime.principal,
    agentId: runtime.executionContext.agentId,
    operationId: runtime.executionContext.operationId,
    conversationId: runtime.executionContext.conversationId,
    ...(error !== undefined && { error: getErrorMessage(error) }),
  })

const toolEventContext = (
  toolDef: AiToolDefinition,
  { executionContext }: ToolAuthorizationRuntime
) => ({
  agentId: executionContext.agentId,
  sessionId: executionContext.conversationId,
  operationId: executionContext.operationId,
  toolName: toolDef.name,
  sourceType: toolDef.sourceType,
  ...(toolDef.action && { action: toolDef.action }),
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
    const isMutating =
      toolDef.authorization?.permissionLevel === PermissionLevel.WRITE ||
      toolDef.authorization?.permissionLevel === PermissionLevel.EXECUTE
    const isRequesterRedacted = toolDef.requesterRedactedTool === toolDef.tool
    let validatedInput = input
    if (isMutating) {
      const schema =
        toolDef.authoritativeInputSchema ?? toolDef.tool.inputSchema
      try {
        validatedInput = await validateTypes({
          value: input,
          schema,
        })
      } catch (error) {
        if (isRequesterRedacted) {
          throw new Error("Tool input is invalid")
        }
        throw error
      }
    }
    if (gate) {
      const gateResult = await gate.intercept(validatedInput, {
        toolCallId: options?.toolCallId ?? "",
        messages: options?.messages,
      })
      if (gateResult) {
        return gateResult
      }
    }
    const executeTool = async () => {
      try {
        const result = await execute(validatedInput, options)
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
          events.action.aiAgentToolExecuted(toolEventContext(toolDef, runtime))
        }
        return authorizedResult
      } catch (error) {
        if (runtime) {
          logToolExecution("error", toolDef, runtime, error)
          events.action.aiAgentToolFailed({
            ...toolEventContext(toolDef, runtime),
            reason: ActionFailureReason.ERROR,
            errorMessage: getErrorMessage(error),
          })
        }
        throw error
      }
    }
    // Automation triggers are already metered as automation steps.
    return toolDef.action === ToolAction.TRIGGER
      ? await executeTool()
      : await quotas.addAction(ActionType.AI_AGENT, executeTool)
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
