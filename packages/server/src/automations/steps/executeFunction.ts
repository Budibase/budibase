import { v4 as uuid } from "uuid"
import { z } from "zod"
import { JSONLimitError, validateJSONLimits } from "@budibase/functions-runtime"
import {
  DEFAULT_FUNCTION_LIMITS,
  FunctionErrorCode,
  type AutomationStepInputBase,
  type ExecuteFunctionStepInputs,
  type ExecuteFunctionStepOutputs,
  type FunctionDocument,
  type FunctionError,
  type FunctionReadiness,
  type FunctionRunResult,
  type JSONValue,
} from "@budibase/types"
import { areFunctionsEnabled } from "../../middleware/functionsEnabled"
import {
  get as getFunction,
  getFunctionReadiness,
} from "../../sdk/workspace/functions"
import {
  functionRunOrchestrator,
  type FunctionRunOrchestrationOptions,
} from "../functions/orchestrator"

const ERROR_MESSAGES: Record<FunctionErrorCode, string> = {
  [FunctionErrorCode.FUNCTIONS_DISABLED]: "Functions are disabled",
  [FunctionErrorCode.FUNCTION_COMPILE_ERROR]: "Function compilation failed",
  [FunctionErrorCode.FUNCTION_COMPILE_TIMEOUT]:
    "Function compilation timed out",
  [FunctionErrorCode.FUNCTION_BUILD_REQUIRED]: "The Function must be built",
  [FunctionErrorCode.FUNCTION_BUILD_FAILED]: "The Function build failed",
  [FunctionErrorCode.FUNCTION_RUNTIME_ERROR]: "Function execution failed",
  [FunctionErrorCode.FUNCTION_TIMEOUT]: "Function execution timed out",
  [FunctionErrorCode.FUNCTION_MEMORY_LIMIT]: "Function memory limit exceeded",
  [FunctionErrorCode.FUNCTION_QUERY_DENIED]: "Function query denied",
  [FunctionErrorCode.FUNCTION_QUERY_LIMIT]: "Function query limit exceeded",
  [FunctionErrorCode.FUNCTION_OUTPUT_INVALID]: "Function output is invalid",
  [FunctionErrorCode.FUNCTION_EXECUTOR_BUSY]: "Function executor is busy",
  [FunctionErrorCode.FUNCTION_CONFIGURATION_ERROR]:
    "The Function automation step is missing required configuration",
  [FunctionErrorCode.FUNCTION_INPUT_INVALID]:
    "Function inputs must be a JSON-compatible object",
  [FunctionErrorCode.FUNCTION_ORCHESTRATOR_INTERRUPTED]:
    "Function execution was interrupted",
}

class FunctionActionError extends Error {
  constructor(readonly code: FunctionErrorCode) {
    super(ERROR_MESSAGES[code])
  }
}

const jsonPrimitiveSchema = z.union([
  z.string(),
  z.number().finite(),
  z.boolean(),
  z.null(),
])

const jsonValueSchema: z.ZodType<JSONValue> = z.lazy(() =>
  z.union([
    jsonPrimitiveSchema,
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ])
)

const jsonRecordSchema = z.record(z.string(), jsonValueSchema)

export interface ExecuteFunctionDependencies {
  orchestrate: (
    options: FunctionRunOrchestrationOptions
  ) => Promise<FunctionRunResult>
  functionsEnabled: () => Promise<boolean>
  getFunction: (functionId: string) => Promise<FunctionDocument | undefined>
  getReadiness: (fn: FunctionDocument) => Promise<FunctionReadiness>
  createRunId: () => string
}

const defaultDependencies: ExecuteFunctionDependencies = {
  orchestrate: options => functionRunOrchestrator.execute(options),
  functionsEnabled: areFunctionsEnabled,
  getFunction,
  getReadiness: getFunctionReadiness,
  createRunId: uuid,
}

const failure = (error: FunctionError): ExecuteFunctionStepOutputs => ({
  success: false,
  status: "error",
  error,
})

const actionFailure = (code: FunctionErrorCode) =>
  failure({ code, message: ERROR_MESSAGES[code] })

const parseInputs = (
  inputs: Record<string, JSONValue>
): Record<string, JSONValue> => {
  const parsed = jsonRecordSchema.safeParse(inputs)
  if (!parsed.success) {
    throw new FunctionActionError(FunctionErrorCode.FUNCTION_INPUT_INVALID)
  }
  try {
    validateJSONLimits(parsed.data, {
      maxBytes: DEFAULT_FUNCTION_LIMITS.run.maxInputBytes,
      maxDepth: DEFAULT_FUNCTION_LIMITS.run.maxInputDepth,
    })
  } catch (error) {
    if (error instanceof JSONLimitError) {
      throw new FunctionActionError(FunctionErrorCode.FUNCTION_INPUT_INVALID)
    }
    throw error
  }
  return parsed.data
}

const resultToOutputs = (
  result: FunctionRunResult
): ExecuteFunctionStepOutputs => {
  if (result.status === "success") {
    return {
      success: true,
      status: "success",
      output: result.output || {},
    }
  }
  if (result.status === "stopped") {
    return {
      success: true,
      status: "stopped",
      error: result.error,
    }
  }
  return result.error
    ? failure(result.error)
    : actionFailure(FunctionErrorCode.FUNCTION_RUNTIME_ERROR)
}

export const executeFunction = async (
  {
    inputs,
    appId,
    automationId,
    stepId,
    context,
  }: {
    inputs: ExecuteFunctionStepInputs
    appId: string
    automationId?: string
    stepId?: string
    context: AutomationStepInputBase["context"]
  },
  dependencies: ExecuteFunctionDependencies = defaultDependencies
): Promise<ExecuteFunctionStepOutputs> => {
  try {
    if (!(await dependencies.functionsEnabled())) {
      throw new FunctionActionError(FunctionErrorCode.FUNCTIONS_DISABLED)
    }
    if (!inputs.functionId || !automationId || !stepId) {
      throw new FunctionActionError(
        FunctionErrorCode.FUNCTION_CONFIGURATION_ERROR
      )
    }
    const functionInputs = parseInputs(inputs.inputs)
    const fn = await dependencies.getFunction(inputs.functionId)
    if (!fn) {
      throw new FunctionActionError(FunctionErrorCode.FUNCTION_BUILD_REQUIRED)
    }
    const readiness = await dependencies.getReadiness(fn)
    if (readiness === "build_failed") {
      throw new FunctionActionError(FunctionErrorCode.FUNCTION_BUILD_FAILED)
    }
    if (readiness !== "ready" || !fn.artifact) {
      throw new FunctionActionError(FunctionErrorCode.FUNCTION_BUILD_REQUIRED)
    }

    const runId = dependencies.createRunId()
    const contextSignal =
      context.signal instanceof AbortSignal ? context.signal : undefined
    const result = await dependencies.orchestrate({
      request: {
        runId,
        artifact: fn.artifact,
        inputs: functionInputs,
        limits: DEFAULT_FUNCTION_LIMITS.run,
      },
      capabilityScope: {
        runId,
        workspaceId: appId,
        functionId: fn._id,
        sourceHash: fn.artifact.sourceHash,
        invocation: {
          type: "automation",
          automationId,
          automationStepId: stepId,
        },
        executionUser: context.user,
        capabilities: fn.capabilities,
        limits: DEFAULT_FUNCTION_LIMITS.run,
      },
      signal: contextSignal,
    })
    if (result.runId !== runId) {
      throw new FunctionActionError(FunctionErrorCode.FUNCTION_RUNTIME_ERROR)
    }
    return resultToOutputs(result)
  } catch (error) {
    return error instanceof FunctionActionError
      ? actionFailure(error.code)
      : actionFailure(FunctionErrorCode.FUNCTION_RUNTIME_ERROR)
  }
}

export const run = executeFunction
