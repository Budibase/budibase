import { asSchema, jsonSchema, validateTypes } from "@ai-sdk/provider-utils"
import { type ModelMessage, type Tool, type ToolSet } from "ai"
import type { JSONSchema7 } from "json-schema"
import { getErrorMessage } from "@budibase/backend-core"
import {
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

export interface ToolInterceptionOptions {
  toolCallId: string
  messages?: ModelMessage[]
}

export interface EscalationGateRuntime {
  // Resolves to the refusal result to return in place of executing, or
  // undefined when no rule matches and the call should proceed.
  intercept: (
    input: unknown,
    options: ToolInterceptionOptions
  ) => Promise<Record<string, unknown> | undefined>
}

export interface RequesterValidationRuntime {
  // Resolves to the validation preview to return instead of executing, or
  // undefined when this exact call was confirmed and may proceed.
  intercept: (
    input: unknown,
    options: ToolInterceptionOptions
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

const wrapTool = (
  toolDef: AiToolDefinition,
  runtime?: ToolAuthorizationRuntime,
  gate?: EscalationGateRuntime,
  validation?: RequesterValidationRuntime
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
    if (validation) {
      const validationResult = await validation.intercept(input, {
        toolCallId: options?.toolCallId ?? "",
        messages: options?.messages,
      })
      if (validationResult) {
        return validationResult
      }
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
      }
      return authorizedResult
    } catch (error) {
      if (runtime) {
        logToolExecution("error", toolDef, runtime, error)
      }
      throw error
    }
  }

  const relaxRequiredFields = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map(relaxRequiredFields)
    }
    if (!value || typeof value !== "object") {
      return value
    }
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, child]) =>
        key === "required" ? [] : [[key, relaxRequiredFields(child)]]
      )
    )
  }
  const inputSchema = validation
    ? jsonSchema(
        async () => {
          const resolved = await asSchema(toolDef.tool.inputSchema).jsonSchema
          return relaxRequiredFields(resolved) as JSONSchema7
        },
        { validate: value => ({ success: true, value }) }
      )
    : toolDef.tool.inputSchema

  return {
    ...toolDef.tool,
    inputSchema,
    execute: wrappedExecute,
  }
}

export const toToolSet = (
  tools: AiToolDefinition[],
  runtimes: Map<string, ToolAuthorizationRuntime> = new Map(),
  gates: Map<string, EscalationGateRuntime> = new Map(),
  validations: Map<string, RequesterValidationRuntime> = new Map()
): ToolSet => {
  return Object.fromEntries(
    tools.map(toolDef => [
      toolDef.name,
      wrapTool(
        toolDef,
        runtimes.get(toolDef.name),
        gates.get(toolDef.name),
        validations.get(toolDef.name)
      ),
    ])
  )
}

export { default as budibase } from "./budibase"
export * from "./restQuery"
