import { DEFAULT_FUNCTION_LIMITS, FunctionErrorCode } from "@budibase/types"
import type {
  FunctionExecutionContext,
  FunctionExecutor,
  FunctionRunRequest,
  FunctionRunResult,
} from "@budibase/types"
import { JSONLimitError, validateJSONLimits } from "./jsonLimits"
import { executeFunctionInIsolate } from "./runtime"

const BUSY_MESSAGE = "Function executor is busy"
const INVALID_INPUT_MESSAGE = "Function input is invalid"

interface LocalFunctionExecutorOptions {
  maxConcurrentRuns?: number
}

const failureResult = (
  request: FunctionRunRequest,
  startedAt: number,
  code: FunctionErrorCode,
  message: string
): FunctionRunResult => ({
  runId: request.runId,
  status: "error",
  metrics: {
    durationMs: Date.now() - startedAt,
    queryCount: 0,
    outputBytes: 0,
    logBytes: 0,
  },
  error: {
    code,
    message,
  },
})

export class LocalFunctionExecutor implements FunctionExecutor {
  private readonly activeRunIds = new Set<string>()
  private readonly maxConcurrentRuns: number

  constructor({
    maxConcurrentRuns = DEFAULT_FUNCTION_LIMITS.service.maxConcurrentRuns,
  }: LocalFunctionExecutorOptions = {}) {
    this.maxConcurrentRuns = maxConcurrentRuns
  }

  async execute(
    request: FunctionRunRequest,
    context: FunctionExecutionContext
  ): Promise<FunctionRunResult> {
    const startedAt = Date.now()
    if (
      this.activeRunIds.has(request.runId) ||
      this.activeRunIds.size >= this.maxConcurrentRuns
    ) {
      return failureResult(
        request,
        startedAt,
        FunctionErrorCode.FUNCTION_EXECUTOR_BUSY,
        BUSY_MESSAGE
      )
    }

    try {
      validateJSONLimits(request.inputs, {
        maxBytes: request.limits.maxInputBytes,
        maxDepth: request.limits.maxInputDepth,
      })
    } catch (error) {
      if (error instanceof JSONLimitError) {
        return failureResult(
          request,
          startedAt,
          FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
          INVALID_INPUT_MESSAGE
        )
      }
      throw error
    }

    this.activeRunIds.add(request.runId)
    try {
      return await executeFunctionInIsolate(request, context)
    } finally {
      this.activeRunIds.delete(request.runId)
    }
  }
}

export const functionExecutor = new LocalFunctionExecutor()
