import { context } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { ActionType, FunctionErrorCode } from "@budibase/types"
import type {
  FunctionCapabilityHandler,
  FunctionCapabilityRequest,
  FunctionQueryCapability,
  FunctionRunLimits,
  JSONValue,
  UserBindings,
} from "@budibase/types"
import * as queryController from "../../api/controllers/query"
import { buildCtx } from "../steps/utils"
import { JSONLimitError, validateJSONLimits } from "./jsonLimits"

const QUERY_DENIED_MESSAGE = "Function query denied"
const QUERY_LIMIT_MESSAGE = "Function query limit exceeded"
const QUERY_FAILED_MESSAGE = "Function query failed"

export interface FunctionInvocationScope {
  runId: string
  workspaceId: string
  functionId: string
  sourceHash: string
  invocation: {
    type: "automation"
    automationId: string
    automationStepId: string
  }
  executionUser?: UserBindings
  capabilities: Readonly<Record<string, FunctionQueryCapability>>
  limits: FunctionRunLimits
  deadline: number
}

export interface FunctionInvocationScopeInput {
  runId: string
  workspaceId: string
  functionId: string
  sourceHash: string
  invocation: {
    type: "automation"
    automationId: string
    automationStepId: string
  }
  executionUser?: UserBindings
  capabilities: FunctionQueryCapability[]
  limits: FunctionRunLimits
  deadline?: number
}

export interface FunctionCapabilityExecution {
  scope: FunctionInvocationScope
  capability: FunctionQueryCapability
  parameters: Record<string, string | null>
}

export interface FunctionCapabilityLog {
  capabilityId: string
  durationMs: number
  responseBytes: number
  result: "success" | "error"
}

export interface FunctionCapabilityServiceDependencies {
  executeQuery?: (execution: FunctionCapabilityExecution) => Promise<object>
  log?: (entry: FunctionCapabilityLog) => void
  now?: () => number
}

export class FunctionCapabilityError extends Error {
  constructor(
    readonly code: FunctionErrorCode,
    message: string
  ) {
    super(message)
  }
}

const denied = () =>
  new FunctionCapabilityError(
    FunctionErrorCode.FUNCTION_QUERY_DENIED,
    QUERY_DENIED_MESSAGE
  )

const limited = () =>
  new FunctionCapabilityError(
    FunctionErrorCode.FUNCTION_QUERY_LIMIT,
    QUERY_LIMIT_MESSAGE
  )

const failed = () =>
  new FunctionCapabilityError(
    FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
    QUERY_FAILED_MESSAGE
  )

export const createFunctionInvocationScope = ({
  capabilities,
  deadline,
  limits,
  ...input
}: FunctionInvocationScopeInput): FunctionInvocationScope => {
  const capabilityMap: Record<string, FunctionQueryCapability> = {}
  for (const capability of capabilities) {
    const parameterNames = [...capability.parameterNames]
    Object.freeze(parameterNames)
    const storedCapability = {
      ...capability,
      parameterNames,
    }
    Object.freeze(storedCapability)
    capabilityMap[capability.capabilityId] = storedCapability
  }
  Object.freeze(capabilityMap)

  return {
    ...input,
    capabilities: capabilityMap,
    limits,
    deadline: deadline ?? Date.now() + limits.timeoutMs,
  }
}

const defaultExecuteQuery = async ({
  scope,
  capability,
  parameters,
}: FunctionCapabilityExecution) =>
  context.doInWorkspaceContext(scope.workspaceId, async () => {
    const ctx = buildCtx(scope.workspaceId, null, {
      body: { parameters },
      params: { queryId: capability.queryId },
      user: scope.executionUser,
    })
    await queryController.executeV2AsAutomation(ctx)
    return ctx.body
  })

const executeMeteredQuery = async (execute: () => Promise<object>) => {
  const outcome = await quotas.addAction(
    ActionType.AUTOMATION_STEP,
    async (): Promise<
      { success: true; response: object } | { success: false }
    > => {
      try {
        return {
          success: true,
          response: await execute(),
        }
      } catch {
        return { success: false }
      }
    }
  )
  if (!outcome.success) {
    throw failed()
  }
  return outcome.response
}

const normalizeResponse = (
  response: object,
  limits: FunctionRunLimits
): { value: JSONValue; bytes: number } => {
  let serialized: string | undefined
  try {
    serialized = JSON.stringify(response)
  } catch {
    throw limited()
  }
  if (!serialized) {
    throw limited()
  }

  const normalized: JSONValue = JSON.parse(serialized)
  try {
    validateJSONLimits(normalized, {
      maxBytes: limits.maxQueryResponseBytes,
      maxDepth: limits.maxQueryResponseDepth,
    })
  } catch (error) {
    if (error instanceof JSONLimitError) {
      throw limited()
    }
    throw error
  }
  return {
    value: normalized,
    bytes: Buffer.byteLength(serialized),
  }
}

const validateParameters = (
  parameters: Record<string, JSONValue>,
  capability: FunctionQueryCapability,
  limits: FunctionRunLimits
): Record<string, string | null> => {
  try {
    validateJSONLimits(parameters, {
      maxBytes: limits.maxInputBytes,
      maxDepth: limits.maxInputDepth,
    })
  } catch (error) {
    if (error instanceof JSONLimitError) {
      throw limited()
    }
    throw error
  }

  const allowedParameters = new Set(capability.parameterNames)
  const validated: Record<string, string | null> = {}
  for (const [name, value] of Object.entries(parameters)) {
    if (
      !allowedParameters.has(name) ||
      (value !== null && typeof value !== "string")
    ) {
      throw denied()
    }
    validated[name] = value
  }
  return validated
}

// This can be replaced with persistent logging or metrics collection when needed.
const defaultLog = (entry: FunctionCapabilityLog) => {
  console.log(
    `Function capability=${entry.capabilityId} result=${entry.result} durationMs=${entry.durationMs} responseBytes=${entry.responseBytes}`
  )
}

export class FunctionCapabilityService {
  private active = true
  private remainingQueryCalls: number
  private activeQueryCalls = 0
  private readonly executeQuery: (
    execution: FunctionCapabilityExecution
  ) => Promise<object>
  private readonly log: (entry: FunctionCapabilityLog) => void
  private readonly now: () => number

  constructor(
    private readonly scope: FunctionInvocationScope,
    dependencies: FunctionCapabilityServiceDependencies = {}
  ) {
    this.remainingQueryCalls = scope.limits.maxQueryCalls
    this.executeQuery = dependencies.executeQuery || defaultExecuteQuery
    this.log = dependencies.log || defaultLog
    this.now = dependencies.now || Date.now
  }

  close = () => {
    this.active = false
  }

  invokeCapability: FunctionCapabilityHandler = async request => {
    const capability = this.authorize(request)
    const parameters = validateParameters(
      request.parameters,
      capability,
      this.scope.limits
    )
    this.reserveQuery(request)

    const startedAt = this.now()
    let responseBytes = 0
    let result: FunctionCapabilityLog["result"] = "error"
    try {
      const response = await executeMeteredQuery(() =>
        this.executeQuery({
          scope: this.scope,
          capability,
          parameters,
        })
      )
      const normalized = normalizeResponse(response, this.scope.limits)
      responseBytes = normalized.bytes
      result = "success"
      return normalized.value
    } finally {
      this.activeQueryCalls -= 1
      this.log({
        capabilityId: capability.capabilityId,
        durationMs: this.now() - startedAt,
        responseBytes,
        result,
      })
    }
  }

  private authorize(request: FunctionCapabilityRequest) {
    if (
      !this.active ||
      request.signal.aborted ||
      request.runId !== this.scope.runId ||
      this.now() > this.scope.deadline
    ) {
      throw denied()
    }

    const capability = this.scope.capabilities[request.capabilityId]
    if (!capability) {
      throw denied()
    }
    return capability
  }

  private reserveQuery(request: FunctionCapabilityRequest) {
    if (
      !this.active ||
      request.signal.aborted ||
      this.remainingQueryCalls <= 0 ||
      this.activeQueryCalls >= this.scope.limits.maxConcurrentQueryCalls
    ) {
      throw limited()
    }
    this.remainingQueryCalls -= 1
    this.activeQueryCalls += 1
  }
}
