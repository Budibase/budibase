import { FunctionErrorCode } from "@budibase/types"
import type {
  FunctionCapabilityHandler,
  FunctionRunRequest,
  FunctionRunResult,
  JSONValue,
} from "@budibase/types"
import ivm from "isolated-vm"
import { z } from "zod"
import { isolateBootstrap } from "./isolateBootstrap"

export const FUNCTION_INPUTS_GLOBAL = "__budibaseInputs"
export const FUNCTION_INVOKE_QUERY_GLOBAL = "__budibaseInvokeQuery"

const INVALID_OUTPUT_MESSAGE = "Function output is invalid"
const RUNTIME_ERROR_MESSAGE = "Function execution failed"
const QUERY_DENIED_MESSAGE = "Function query denied"
const QUERY_LIMIT_MESSAGE = "Function query limit exceeded"
const QUERY_FAILED_MESSAGE = "Function query failed"
const MEMORY_LIMIT_MESSAGE = "Function memory limit exceeded"
const TIMEOUT_MESSAGE = "Function run timed out"

const functionResultSchema = z
  .object({
    output: z.unknown(),
    status: z.enum(["success", "error", "stopped"]).optional(),
  })
  .strict()

class FunctionOutputError extends Error {}

const normalizeJSON = (
  value: unknown,
  maxDepth: number,
  message: string,
  depth = 0,
  ancestors = new WeakSet<object>()
): JSONValue => {
  if (depth > maxDepth) {
    throw new FunctionOutputError(message)
  }
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }
  if (typeof value !== "object" || ancestors.has(value)) {
    throw new FunctionOutputError(message)
  }

  if (
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) !== "[object Object]"
  ) {
    throw new FunctionOutputError(message)
  }

  ancestors.add(value)
  try {
    if (Array.isArray(value)) {
      return value.map(item =>
        normalizeJSON(item, maxDepth, message, depth + 1, ancestors)
      )
    }

    const result: Record<string, JSONValue> = {}
    for (const [key, item] of Object.entries(value)) {
      Object.defineProperty(result, key, {
        configurable: true,
        enumerable: true,
        value: normalizeJSON(item, maxDepth, message, depth + 1, ancestors),
        writable: true,
      })
    }
    return result
  } finally {
    ancestors.delete(value)
  }
}

const normalizeValue = (
  value: unknown,
  maxDepth: number,
  maxBytes: number,
  message: string
) => {
  const normalized = normalizeJSON(value, maxDepth, message)
  const bytes = Buffer.byteLength(JSON.stringify(normalized))
  if (bytes > maxBytes) {
    throw new FunctionOutputError(message)
  }
  return { normalized, bytes }
}

const normalizeRecord = (
  value: unknown,
  maxDepth: number,
  maxBytes: number,
  message: string
) => {
  const { normalized, bytes } = normalizeValue(
    value,
    maxDepth,
    maxBytes,
    message
  )
  if (
    normalized === null ||
    Array.isArray(normalized) ||
    typeof normalized !== "object"
  ) {
    throw new FunctionOutputError(message)
  }
  return { normalized, bytes }
}

const createResult = (
  request: FunctionRunRequest,
  startedAt: number,
  queryCount: number,
  value: unknown
): FunctionRunResult => {
  const parsed = functionResultSchema.parse(value)
  const { normalized: output, bytes: outputBytes } = normalizeRecord(
    parsed.output,
    request.limits.maxOutputDepth,
    request.limits.maxOutputBytes,
    INVALID_OUTPUT_MESSAGE
  )
  return {
    runId: request.runId,
    status: parsed.status || "success",
    output,
    metrics: {
      durationMs: Date.now() - startedAt,
      queryCount,
      outputBytes,
      logBytes: 0,
    },
  }
}

const failureMessage = (code: FunctionErrorCode) => {
  switch (code) {
    case FunctionErrorCode.FUNCTION_OUTPUT_INVALID:
      return INVALID_OUTPUT_MESSAGE
    case FunctionErrorCode.FUNCTION_QUERY_LIMIT:
      return QUERY_LIMIT_MESSAGE
    case FunctionErrorCode.FUNCTION_QUERY_DENIED:
      return QUERY_DENIED_MESSAGE
    case FunctionErrorCode.FUNCTION_MEMORY_LIMIT:
      return MEMORY_LIMIT_MESSAGE
    case FunctionErrorCode.FUNCTION_TIMEOUT:
      return TIMEOUT_MESSAGE
    default:
      return RUNTIME_ERROR_MESSAGE
  }
}

const createFailure = (
  request: FunctionRunRequest,
  startedAt: number,
  queryCount: number,
  code: FunctionErrorCode
): FunctionRunResult => ({
  runId: request.runId,
  status: "error",
  metrics: {
    durationMs: Date.now() - startedAt,
    queryCount,
    outputBytes: 0,
    logBytes: 0,
  },
  error: {
    code,
    message: failureMessage(code),
  },
})

const createStopped = (
  request: FunctionRunRequest,
  startedAt: number,
  queryCount: number
): FunctionRunResult => ({
  runId: request.runId,
  status: "stopped",
  metrics: {
    durationMs: Date.now() - startedAt,
    queryCount,
    outputBytes: 0,
    logBytes: 0,
  },
})

interface FunctionRuntimeContext {
  signal: AbortSignal
  invokeCapability: FunctionCapabilityHandler
}

export const executeFunctionInIsolate = async (
  request: FunctionRunRequest,
  runtimeContext: FunctionRuntimeContext
): Promise<FunctionRunResult> => {
  const startedAt = Date.now()
  let queryCount = 0
  let concurrentQueryCount = 0
  let queryLimitExceeded = false
  let queryDenied = false
  const allowedCapabilityIds = new Set(request.artifact.capabilityIds)
  let errorCode: FunctionErrorCode = FunctionErrorCode.FUNCTION_RUNTIME_ERROR
  let wallTimedOut = false
  let cancelled = runtimeContext.signal.aborted
  const queryAbortController = new AbortController()
  let isolate: ivm.Isolate
  try {
    isolate = new ivm.Isolate({
      memoryLimit: request.limits.isolateMemoryLimitMb,
    })
  } catch {
    return createFailure(request, startedAt, queryCount, errorCode)
  }

  const cancel = () => {
    cancelled = true
    queryAbortController.abort()
    if (!isolate.isDisposed) {
      isolate.dispose()
    }
  }
  runtimeContext.signal.addEventListener("abort", cancel, { once: true })
  if (cancelled) {
    cancel()
  }

  const wallTimer = setTimeout(() => {
    wallTimedOut = true
    queryAbortController.abort()
    if (!isolate.isDisposed) {
      isolate.dispose()
    }
  }, request.limits.timeoutMs)

  try {
    const context = await isolate.createContext()
    const capabilityReference = new ivm.Reference(
      async (capabilityIdValue: unknown, parametersValue: unknown) => {
        if (typeof capabilityIdValue !== "string" || !capabilityIdValue) {
          queryDenied = true
          errorCode = FunctionErrorCode.FUNCTION_QUERY_DENIED
          return { error: QUERY_DENIED_MESSAGE }
        }
        if (!allowedCapabilityIds.has(capabilityIdValue)) {
          queryDenied = true
          errorCode = FunctionErrorCode.FUNCTION_QUERY_DENIED
          return { error: QUERY_DENIED_MESSAGE }
        }
        let parameters: Record<string, JSONValue>
        try {
          parameters = normalizeRecord(
            parametersValue,
            request.limits.maxInputDepth,
            request.limits.maxInputBytes,
            QUERY_DENIED_MESSAGE
          ).normalized
        } catch {
          queryDenied = true
          errorCode = FunctionErrorCode.FUNCTION_QUERY_DENIED
          return { error: QUERY_DENIED_MESSAGE }
        }
        if (
          queryCount >= request.limits.maxQueryCalls ||
          concurrentQueryCount >= request.limits.maxConcurrentQueryCalls
        ) {
          queryLimitExceeded = true
          errorCode = FunctionErrorCode.FUNCTION_QUERY_LIMIT
          return { error: QUERY_LIMIT_MESSAGE }
        }
        queryCount += 1
        concurrentQueryCount += 1
        let result: JSONValue
        try {
          result = await runtimeContext.invokeCapability({
            runId: request.runId,
            capabilityId: capabilityIdValue,
            parameters,
            signal: queryAbortController.signal,
          })
        } catch {
          return { error: QUERY_FAILED_MESSAGE }
        } finally {
          concurrentQueryCount -= 1
        }
        try {
          return {
            result: normalizeValue(
              result,
              request.limits.maxQueryResponseDepth,
              request.limits.maxQueryResponseBytes,
              QUERY_DENIED_MESSAGE
            ).normalized,
          }
        } catch {
          queryDenied = true
          errorCode = FunctionErrorCode.FUNCTION_QUERY_DENIED
          return { error: QUERY_DENIED_MESSAGE }
        }
      }
    )
    try {
      const jail = context.global
      await jail.set("globalThis", jail.derefInto())
      await jail.set(
        "__budibaseInputsValue",
        new ivm.ExternalCopy(request.inputs).copyInto({ release: true })
      )
      await jail.set("__budibaseInvokeCapabilityReference", capabilityReference)

      const bootstrap = await isolate.compileScript(isolateBootstrap, {
        filename: "function:///sdk.js",
      })
      try {
        await bootstrap.run(context, { timeout: request.limits.timeoutMs })
      } finally {
        bootstrap.release()
      }

      const artifact = await isolate.compileModule(
        request.artifact.compiledJavaScript,
        { filename: "function:///artifact.js" }
      )
      try {
        if (artifact.dependencySpecifiers.length > 0) {
          throw new Error("Function artifact contains unresolved imports")
        }
        await artifact.instantiate(context, () => {
          throw new Error("Function artifact contains unresolved imports")
        })
        await artifact.evaluate({ timeout: request.limits.timeoutMs })

        const entrypoint = await artifact.namespace.get("default", {
          reference: true,
        })
        try {
          if (entrypoint.typeof !== "function") {
            throw new Error("Function artifact has no default entrypoint")
          }
          const value: unknown = await entrypoint.apply(undefined, [], {
            result: { copy: true, promise: true },
            timeout: request.limits.timeoutMs,
          })
          if (queryLimitExceeded || queryDenied) {
            return createFailure(
              request,
              startedAt,
              queryCount,
              queryLimitExceeded
                ? FunctionErrorCode.FUNCTION_QUERY_LIMIT
                : FunctionErrorCode.FUNCTION_QUERY_DENIED
            )
          }
          try {
            return createResult(request, startedAt, queryCount, value)
          } catch {
            errorCode = FunctionErrorCode.FUNCTION_OUTPUT_INVALID
            throw new FunctionOutputError(INVALID_OUTPUT_MESSAGE)
          }
        } finally {
          entrypoint.release()
        }
      } finally {
        artifact.release()
      }
    } finally {
      capabilityReference.release()
      context.release()
    }
  } catch (error) {
    if (wallTimedOut) {
      errorCode = FunctionErrorCode.FUNCTION_TIMEOUT
    } else if (cancelled) {
      return createStopped(request, startedAt, queryCount)
    } else if (error instanceof FunctionOutputError) {
      errorCode = FunctionErrorCode.FUNCTION_OUTPUT_INVALID
    } else if (isolate.isDisposed) {
      errorCode = FunctionErrorCode.FUNCTION_MEMORY_LIMIT
    } else if (String(error).toLowerCase().includes("timed out")) {
      errorCode = FunctionErrorCode.FUNCTION_TIMEOUT
    }
    return createFailure(request, startedAt, queryCount, errorCode)
  } finally {
    clearTimeout(wallTimer)
    runtimeContext.signal.removeEventListener("abort", cancel)
    queryAbortController.abort()
    if (!isolate.isDisposed) {
      isolate.dispose()
    }
  }
}
