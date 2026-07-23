import { context, type RedisClient } from "@budibase/backend-core"
import type {
  FunctionQueryBrokerRequest,
  FunctionQueryCapability,
  FunctionRunGrant,
  JSONValue,
} from "@budibase/types"
import { FunctionErrorCode } from "@budibase/types"
import { z } from "zod"
import * as queryController from "../api/controllers/query"
import { buildCtx } from "../automations/steps/utils"
import { areFunctionsEnabled } from "../middleware/functionsEnabled"
import { FunctionExecutionError } from "./errors"
import {
  consumeFunctionQueryGrant,
  getFunctionRunGrant,
  releaseFunctionQueryGrant,
} from "./grants"

interface FunctionScopeDocument {
  _id: string
  artifact?: {
    sourceHash: string
  }
}

export interface FunctionQueryExecution {
  grant: FunctionRunGrant
  capability: FunctionQueryCapability
  parameters: Record<string, string | null>
}

export interface FunctionQueryBrokerDependencies {
  client?: RedisClient
  executeQuery?: (execution: FunctionQueryExecution) => Promise<object>
  functionsEnabled?: (workspaceId: string) => Promise<boolean>
  validateScope?: (grant: FunctionRunGrant) => Promise<boolean>
  record?: (entry: FunctionQueryBrokerRecord) => void
}

export interface FunctionQueryBrokerRecord {
  capabilityId: string
  durationMs: number
  responseBytes: number
  result: "success" | "error"
}

const denied = () =>
  new FunctionExecutionError(FunctionErrorCode.FUNCTION_QUERY_DENIED)

const limited = () =>
  new FunctionExecutionError(FunctionErrorCode.FUNCTION_QUERY_LIMIT)

const requestSchema: z.ZodType<FunctionQueryBrokerRequest> = z
  .object({
    runId: z.string().min(1),
    capabilityId: z.string().min(1),
    parameters: z.record(z.string(), z.string().nullable()),
    grantToken: z.string().min(1),
  })
  .strict()

const getJsonDepth = (value: JSONValue): number => {
  const pending: { value: JSONValue; depth: number }[] = [{ value, depth: 0 }]
  let maxDepth = 0
  while (pending.length > 0) {
    const current = pending.pop()
    if (
      !current ||
      current.value === null ||
      typeof current.value !== "object"
    ) {
      continue
    }
    const depth = current.depth + 1
    maxDepth = Math.max(maxDepth, depth)
    const children = Array.isArray(current.value)
      ? current.value
      : Object.values(current.value)
    for (const child of children) {
      pending.push({ value: child, depth })
    }
  }
  return maxDepth
}

const normalizeJson = (
  value: object,
  maxBytes: number,
  maxDepth: number,
  setBytes: (bytes: number) => void
): { value: JSONValue; bytes: number } => {
  let serialized: string | undefined
  try {
    serialized = JSON.stringify(value)
  } catch {
    throw limited()
  }
  if (!serialized) {
    throw limited()
  }

  const bytes = Buffer.byteLength(serialized, "utf8")
  setBytes(bytes)
  if (bytes > maxBytes) {
    throw limited()
  }

  const normalized: JSONValue = JSON.parse(serialized)
  if (getJsonDepth(normalized) > maxDepth) {
    throw limited()
  }
  return { value: normalized, bytes }
}

const validateParameters = (
  parameters: Record<string, string | null>,
  maxBytes: number,
  maxDepth: number
) => {
  const serialized = JSON.stringify(parameters)
  if (
    Buffer.byteLength(serialized, "utf8") > maxBytes ||
    getJsonDepth(parameters) > maxDepth
  ) {
    throw limited()
  }
}

const defaultFunctionsEnabled = async (workspaceId: string) =>
  context.doInWorkspaceContext(workspaceId, areFunctionsEnabled)

const defaultValidateScope = async (grant: FunctionRunGrant) =>
  context.doInWorkspaceContext(grant.workspaceId, async () => {
    try {
      const document = await context
        .getWorkspaceDB()
        .get<FunctionScopeDocument>(grant.functionId)
      return (
        document._id === grant.functionId &&
        document.artifact?.sourceHash === grant.sourceHash
      )
    } catch {
      return false
    }
  })

const defaultExecuteQuery = async ({
  grant,
  capability,
  parameters,
}: FunctionQueryExecution) =>
  context.doInWorkspaceContext(grant.workspaceId, async () => {
    const ctx = buildCtx(grant.workspaceId, null, {
      body: { parameters },
      params: { queryId: capability.queryId },
      user: grant.executionUser,
    })
    await queryController.executeV2AsAutomation(ctx)
    return ctx.body
  })

const defaultRecord = (entry: FunctionQueryBrokerRecord) => {
  console.log(
    `Function query broker capability=${entry.capabilityId} result=${entry.result} durationMs=${entry.durationMs} responseBytes=${entry.responseBytes}`
  )
}

export const executeFunctionQuery = async (
  request: FunctionQueryBrokerRequest,
  workspaceId?: string,
  dependencies: FunctionQueryBrokerDependencies = {}
): Promise<JSONValue> => {
  const parsedRequest = requestSchema.safeParse(request)
  if (!parsedRequest.success) {
    throw denied()
  }
  request = parsedRequest.data

  const initialGrant = await getFunctionRunGrant(
    request.runId,
    request.grantToken,
    dependencies.client
  )
  if (!initialGrant) {
    throw denied()
  }

  validateParameters(
    request.parameters,
    initialGrant.limits.maxInputBytes,
    initialGrant.limits.maxInputDepth
  )

  const functionsEnabled =
    dependencies.functionsEnabled || defaultFunctionsEnabled
  const validateScope = dependencies.validateScope || defaultValidateScope
  if (
    !(await functionsEnabled(initialGrant.workspaceId)) ||
    !(await validateScope(initialGrant))
  ) {
    throw denied()
  }

  const consumed = await consumeFunctionQueryGrant(
    request.runId,
    request.grantToken,
    request.capabilityId,
    Object.keys(request.parameters),
    workspaceId,
    dependencies.client
  )
  if (
    consumed.status === "budget_exceeded" ||
    consumed.status === "concurrency_exceeded"
  ) {
    throw limited()
  }
  if (consumed.status !== "allowed" || !consumed.grant) {
    throw denied()
  }

  const grant = consumed.grant
  const capability = grant.capabilities[request.capabilityId]
  if (!capability) {
    await releaseFunctionQueryGrant(
      request.runId,
      request.grantToken,
      dependencies.client
    )
    throw denied()
  }

  const executeQuery = dependencies.executeQuery || defaultExecuteQuery
  const record = dependencies.record || defaultRecord
  const startedAt = Date.now()
  let responseBytes = 0
  let result: FunctionQueryBrokerRecord["result"] = "error"
  try {
    const response = await executeQuery({
      grant,
      capability,
      parameters: request.parameters,
    })
    const normalized = normalizeJson(
      response,
      grant.limits.maxQueryResponseBytes,
      grant.limits.maxQueryResponseDepth,
      bytes => {
        responseBytes = bytes
      }
    )
    responseBytes = normalized.bytes
    result = "success"
    return normalized.value
  } catch (error) {
    if (error instanceof FunctionExecutionError) {
      throw error
    }
    throw new FunctionExecutionError(FunctionErrorCode.FUNCTION_RUNTIME_ERROR)
  } finally {
    await releaseFunctionQueryGrant(
      request.runId,
      request.grantToken,
      dependencies.client
    )
    record({
      capabilityId: request.capabilityId,
      durationMs: Date.now() - startedAt,
      responseBytes,
      result,
    })
  }
}
