import {
  PermissionLevel,
  PermissionType,
  ToolExecutionPrincipal,
  ToolType,
  type AgentExecutionContext,
} from "@budibase/types"
import { type Tool, type ToolSet } from "ai"

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
  resultFilter?: {
    collectionKey: string
    permissionType: PermissionType
    permissionLevel: PermissionLevel
    resolveResourceId: (item: unknown) => string | undefined
  }
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
    }
    try {
      const result = await execute(preparedInput, args[1])
      const failureMessage = getToolFailure(result)
      if (failureMessage) {
        throw new Error(failureMessage)
      }
      const authorization = toolDef.authorization
      const resultFilter = authorization?.resultFilter
      let authorizedResult = result
      if (
        runtime &&
        authorization &&
        resultFilter &&
        result &&
        typeof result === "object" &&
        resultFilter.collectionKey in result
      ) {
        const collection = Reflect.get(result, resultFilter.collectionKey)
        if (Array.isArray(collection)) {
          const allowedItems = await Promise.all(
            collection.map(async item => {
              const resourceId = resultFilter.resolveResourceId(item)
              if (!resourceId) {
                return false
              }
              try {
                await runtime.authorize({
                  authorization: {
                    supportedPrincipals: authorization.supportedPrincipals,
                    permissionType: resultFilter.permissionType,
                    permissionLevel: resultFilter.permissionLevel,
                    resourceId,
                  },
                  input: undefined,
                  executionContext: runtime.executionContext,
                  principal: runtime.principal,
                })
                return true
              } catch {
                return false
              }
            })
          )
          authorizedResult = {
            ...result,
            [resultFilter.collectionKey]: collection.filter(
              (_item, index) => allowedItems[index]
            ),
          }
        }
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
