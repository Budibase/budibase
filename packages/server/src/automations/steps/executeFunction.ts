import { v4 as uuid } from "uuid"
import {
  DEFAULT_FUNCTION_LIMITS,
  FunctionErrorCode,
  type ExecuteFunctionStepInputs,
  type ExecuteFunctionStepOutputs,
  type FunctionDocument,
  type FunctionExecutor,
  type FunctionRunResult,
  type FunctionRunSummary,
  type JSONValue,
} from "@budibase/types"
import { z } from "zod"
import { areFunctionsEnabled } from "../../middleware/functionsEnabled"
import { FunctionExecutionError } from "../../functions/errors"
import { LocalRunnerFunctionExecutor } from "../../functions/executor"
import { executeWithFunctionRunGrant } from "../../functions/grants"
import { validateFunctionRunResult } from "../../functions/executor/protocol"

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
  executor: FunctionExecutor
  functionsEnabled: () => Promise<boolean>
  getFunction: (functionId: string) => Promise<FunctionDocument | undefined>
  getReadiness: (
    fn: FunctionDocument
  ) => Promise<"ready" | "build_required" | "build_failed">
  execute: typeof executeWithFunctionRunGrant
  createRunId: () => string
  createRunSummary: (input: {
    runId: string
    functionId: string
    functionName: string
    sourceHash: string
    automationId: string
    stepId: string
  }) => Promise<FunctionRunSummary>
  finalizeRunSummary: (
    runId: string,
    result: FunctionRunResult | { status: "error"; code: FunctionErrorCode }
  ) => Promise<FunctionRunSummary>
}

const defaultDependencies: ExecuteFunctionDependencies = {
  executor: new LocalRunnerFunctionExecutor(),
  functionsEnabled: areFunctionsEnabled,
  getFunction: async functionId =>
    (await import("../../sdk/workspace/functions")).get(functionId),
  getReadiness: async fn =>
    (await import("../../sdk/workspace/functions")).getFunctionReadiness(fn),
  execute: executeWithFunctionRunGrant,
  createRunId: uuid,
  createRunSummary: async input =>
    (await import("../../sdk/workspace/functions")).createRunSummary(input),
  finalizeRunSummary: async (runId, result) =>
    (await import("../../sdk/workspace/functions")).finalizeRunSummary(
      runId,
      result
    ),
}

const failure = (
  error: FunctionExecutionError
): ExecuteFunctionStepOutputs => ({
  success: false,
  status: "error",
  error: {
    code: error.code,
    message: error.message,
  },
})

const invalidInputs = () =>
  new FunctionExecutionError(
    FunctionErrorCode.FUNCTION_PROTOCOL_ERROR,
    "Function inputs must be a JSON-compatible object"
  )

const getJsonDepth = (value: JSONValue): number => {
  const pending: { value: JSONValue; depth: number }[] = [{ value, depth: 0 }]
  let maxDepth = 0
  while (pending.length) {
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

const parseInputs = (
  inputs: ExecuteFunctionStepInputs["inputs"]
): Record<string, JSONValue> => {
  let value: unknown = inputs
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length === 1 &&
    "value" in value
  ) {
    value = value.value
  }
  if (typeof value === "string") {
    try {
      value = JSON.parse(value)
    } catch {
      throw invalidInputs()
    }
  }

  const parsed = jsonRecordSchema.safeParse(value)
  if (!parsed.success) {
    throw invalidInputs()
  }
  const serialized = JSON.stringify(parsed.data)
  if (
    Buffer.byteLength(serialized, "utf8") >
      DEFAULT_FUNCTION_LIMITS.run.maxInputBytes ||
    getJsonDepth(parsed.data) > DEFAULT_FUNCTION_LIMITS.run.maxInputDepth
  ) {
    throw invalidInputs()
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
    ? {
        success: false,
        status: "error",
        error: result.error,
      }
    : failure(
        new FunctionExecutionError(FunctionErrorCode.FUNCTION_RUNTIME_ERROR)
      )
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
    context: Record<string, any>
  },
  dependencies: ExecuteFunctionDependencies = defaultDependencies
): Promise<ExecuteFunctionStepOutputs> => {
  try {
    if (!(await dependencies.functionsEnabled())) {
      throw new FunctionExecutionError(FunctionErrorCode.FUNCTIONS_DISABLED)
    }
    if (!inputs.functionId || !automationId || !stepId) {
      throw invalidInputs()
    }
    const functionInputs = parseInputs(inputs.inputs)
    const fn = await dependencies.getFunction(inputs.functionId)
    if (!fn) {
      throw new FunctionExecutionError(
        FunctionErrorCode.FUNCTION_BUILD_REQUIRED,
        "The Function does not exist in this environment"
      )
    }
    const readiness = await dependencies.getReadiness(fn)
    if (readiness === "build_failed") {
      throw new FunctionExecutionError(FunctionErrorCode.FUNCTION_BUILD_FAILED)
    }
    if (readiness !== "ready" || !fn.artifact) {
      throw new FunctionExecutionError(
        FunctionErrorCode.FUNCTION_BUILD_REQUIRED
      )
    }

    const runId = dependencies.createRunId()
    const capabilities = Object.fromEntries(
      fn.capabilities.map(capability => [capability.capabilityId, capability])
    )
    await dependencies.createRunSummary({
      runId,
      functionId: fn._id,
      functionName: fn.name,
      sourceHash: fn.artifact.sourceHash,
      automationId,
      stepId,
    })
    try {
      const result = validateFunctionRunResult(
        await dependencies.execute(
          dependencies.executor,
          {
            runId,
            artifact: fn.artifact,
            inputs: functionInputs,
            limits: DEFAULT_FUNCTION_LIMITS.run,
          },
          {
            runId,
            workspaceId: appId,
            functionId: fn._id,
            sourceHash: fn.artifact.sourceHash,
            automationId,
            automationStepId: stepId,
            executionUser: context.user,
            capabilities,
          }
        )
      )
      if (result.runId !== runId) {
        throw new FunctionExecutionError(
          FunctionErrorCode.FUNCTION_PROTOCOL_ERROR
        )
      }
      await dependencies.finalizeRunSummary(runId, result)
      return resultToOutputs(result)
    } catch (error) {
      const safeError =
        error instanceof FunctionExecutionError
          ? error
          : new FunctionExecutionError(FunctionErrorCode.FUNCTION_RUNTIME_ERROR)
      await dependencies.finalizeRunSummary(runId, {
        status: "error",
        code: safeError.code,
      })
      return failure(safeError)
    }
  } catch (error) {
    return failure(
      error instanceof FunctionExecutionError
        ? error
        : new FunctionExecutionError(FunctionErrorCode.FUNCTION_RUNTIME_ERROR)
    )
  }
}

export const run = executeFunction
