import { FunctionErrorCode } from "@budibase/types"
import type {
  FunctionCapabilityHandler,
  FunctionCapabilityRequest,
  FunctionQueryCapability,
  FunctionRunLimits,
  JSONValue,
  UserBindings,
} from "@budibase/types"
import { JSONLimitError, validateJSONLimits } from "./jsonLimits"

const QUERY_DENIED_MESSAGE = "Function query denied"
const QUERY_LIMIT_MESSAGE = "Function query limit exceeded"
const QUERY_FAILED_MESSAGE = "Function query failed"

export interface FunctionInvocationScope {
  readonly runId: string
  readonly workspaceId: string
  readonly functionId: string
  readonly sourceHash: string
  readonly invocation: {
    readonly type: "automation"
    readonly automationId: string
    readonly automationStepId: string
  }
  readonly executionUser?: Readonly<UserBindings>
  readonly capabilities: Readonly<
    Record<string, Readonly<FunctionQueryCapability>>
  >
  readonly limits: Readonly<FunctionRunLimits>
  readonly deadline: number
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
  capability: Readonly<FunctionQueryCapability>
  parameters: Record<string, string | null>
}

export interface FunctionCapabilityLog {
  capabilityId: string
  durationMs: number
  responseBytes: number
  result: "success" | "error"
}

export interface FunctionCapabilityServiceDependencies {
  executeQuery: (execution: FunctionCapabilityExecution) => Promise<object>
  meter?: (
    execute: () => Promise<object>
  ) => Promise<FunctionCapabilityMeterResult>
  log?: (entry: FunctionCapabilityLog) => void
}

export type FunctionCapabilityMeterResult =
  | { success: true; response: object }
  | { success: false }

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
  executionUser,
  invocation,
  limits,
  ...input
}: FunctionInvocationScopeInput): FunctionInvocationScope => {
  const capabilityMap: Record<
    string,
    Readonly<FunctionQueryCapability>
  > = Object.create(null)
  for (const capability of capabilities) {
    const storedCapability = Object.freeze({
      ...capability,
      parameterNames: Object.freeze([...capability.parameterNames]),
    })
    capabilityMap[capability.capabilityId] = storedCapability
  }
  Object.freeze(capabilityMap)

  const storedExecutionUser = executionUser
    ? Object.freeze({
        ...executionUser,
        ...(executionUser.oauth2
          ? { oauth2: Object.freeze({ ...executionUser.oauth2 }) }
          : {}),
      })
    : undefined
  const storedLimits = Object.freeze({ ...limits })

  return Object.freeze({
    ...input,
    invocation: Object.freeze({ ...invocation }),
    executionUser: storedExecutionUser,
    capabilities: capabilityMap,
    limits: storedLimits,
    deadline: deadline ?? Date.now() + storedLimits.timeoutMs,
  })
}

const passthroughMeter = async (
  execute: () => Promise<object>
): Promise<FunctionCapabilityMeterResult> => {
  try {
    return { success: true, response: await execute() }
  } catch {
    return { success: false }
  }
}

// This can be replaced with persistent logging or metrics collection when needed.
const defaultLog = (entry: FunctionCapabilityLog) => {
  console.log(
    `Function capability=${entry.capabilityId} result=${entry.result} durationMs=${entry.durationMs} responseBytes=${entry.responseBytes}`
  )
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
  capability: Readonly<FunctionQueryCapability>,
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

export class FunctionCapabilityService {
  private active = true
  private remainingQueryCalls: number
  private activeQueryCalls = 0
  private readonly executeQuery: (
    execution: FunctionCapabilityExecution
  ) => Promise<object>
  private readonly meter: (
    execute: () => Promise<object>
  ) => Promise<FunctionCapabilityMeterResult>
  private readonly log: (entry: FunctionCapabilityLog) => void

  constructor(
    private readonly scope: FunctionInvocationScope,
    dependencies: FunctionCapabilityServiceDependencies
  ) {
    this.remainingQueryCalls = scope.limits.maxQueryCalls
    this.executeQuery = dependencies.executeQuery
    this.meter = dependencies.meter || passthroughMeter
    this.log = dependencies.log || defaultLog
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

    const startedAt = Date.now()
    let responseBytes = 0
    let result: FunctionCapabilityLog["result"] = "error"
    try {
      const outcome = await this.meter(() =>
        this.executeQuery({
          scope: this.scope,
          capability,
          parameters,
        })
      )
      if (!outcome.success) {
        throw failed()
      }
      const response = outcome.response
      const normalized = normalizeResponse(response, this.scope.limits)
      responseBytes = normalized.bytes
      result = "success"
      return normalized.value
    } finally {
      this.activeQueryCalls -= 1
      this.log({
        capabilityId: capability.capabilityId,
        durationMs: Date.now() - startedAt,
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
      Date.now() > this.scope.deadline
    ) {
      throw denied()
    }

    if (!Object.hasOwn(this.scope.capabilities, request.capabilityId)) {
      throw denied()
    }
    return this.scope.capabilities[request.capabilityId]
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
