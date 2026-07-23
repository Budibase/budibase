import { FunctionErrorCode } from "@budibase/types"
import type {
  FunctionRunRequest,
  FunctionRunResult,
  JSONValue,
} from "@budibase/types"
import ivm from "isolated-vm"
import { readFileSync } from "node:fs"
import path from "node:path"
import { z } from "zod"

export const FUNCTION_INPUTS_GLOBAL = "__budibaseInputs"
export const FUNCTION_INVOKE_QUERY_GLOBAL = "__budibaseInvokeQuery"

const INVALID_OUTPUT_MESSAGE = "Function output is invalid"
const RUNTIME_ERROR_MESSAGE = "Function execution failed"
const INVALID_QUERY_MESSAGE = "Function query payload is invalid"
const QUERY_LIMIT_MESSAGE = "Function query limit exceeded"
const QUERY_FAILED_MESSAGE = "Function query failed"
const MEMORY_LIMIT_MESSAGE = "Function memory limit exceeded"
const TIMEOUT_MESSAGE = "Function run timed out"
const bootstrapSource = readFileSync(
  path.join(__dirname, "isolate-bootstrap.js"),
  "utf8"
)

const functionResultSchema = z
  .object({
    output: z.unknown(),
    status: z.enum(["success", "error", "stopped"]).optional(),
  })
  .strict()

export interface FunctionQueryRequest {
  runId: string
  grantToken: string
  capabilityId: string
  parameters: Record<string, JSONValue>
}

export type FunctionQueryHandler = (
  request: FunctionQueryRequest
) => Promise<JSONValue>

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
      result[key] = normalizeJSON(item, maxDepth, message, depth + 1, ancestors)
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

export const executeFunctionInIsolate = async (
  request: FunctionRunRequest,
  queryHandler: FunctionQueryHandler
): Promise<FunctionRunResult> => {
  const startedAt = Date.now()
  let queryCount = 0
  let concurrentQueryCount = 0
  let errorCode: FunctionErrorCode = FunctionErrorCode.FUNCTION_RUNTIME_ERROR
  let wallTimedOut = false
  let isolate: ivm.Isolate
  try {
    isolate = new ivm.Isolate({
      memoryLimit: request.limits.isolateMemoryLimitMb,
    })
  } catch {
    return createFailure(request, startedAt, queryCount, errorCode)
  }

  const wallTimer = setTimeout(() => {
    wallTimedOut = true
    if (!isolate.isDisposed) {
      isolate.dispose()
    }
  }, request.limits.timeoutMs)

  try {
    const context = await isolate.createContext()
    const queryReference = new ivm.Reference(
      async (capabilityIdValue: unknown, parametersValue: unknown) => {
        if (typeof capabilityIdValue !== "string" || !capabilityIdValue) {
          errorCode = FunctionErrorCode.FUNCTION_PROTOCOL_ERROR
          return { error: INVALID_QUERY_MESSAGE }
        }
        let parameters: Record<string, JSONValue>
        try {
          parameters = normalizeRecord(
            parametersValue,
            request.limits.maxInputDepth,
            request.limits.maxInputBytes,
            INVALID_QUERY_MESSAGE
          ).normalized
        } catch {
          errorCode = FunctionErrorCode.FUNCTION_PROTOCOL_ERROR
          return { error: INVALID_QUERY_MESSAGE }
        }
        if (
          queryCount >= request.limits.maxQueryCalls ||
          concurrentQueryCount >= request.limits.maxConcurrentQueryCalls
        ) {
          errorCode = FunctionErrorCode.FUNCTION_QUERY_LIMIT
          return { error: QUERY_LIMIT_MESSAGE }
        }
        queryCount += 1
        concurrentQueryCount += 1
        let result: JSONValue
        try {
          result = await queryHandler({
            runId: request.runId,
            grantToken: request.grantToken,
            capabilityId: capabilityIdValue,
            parameters,
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
              INVALID_QUERY_MESSAGE
            ).normalized,
          }
        } catch {
          errorCode = FunctionErrorCode.FUNCTION_PROTOCOL_ERROR
          return { error: INVALID_QUERY_MESSAGE }
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
      await jail.set("__budibaseInvokeQueryReference", queryReference)

      const bootstrap = await isolate.compileScript(bootstrapSource, {
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
      queryReference.release()
      context.release()
    }
  } catch (error) {
    if (wallTimedOut) {
      errorCode = FunctionErrorCode.FUNCTION_TIMEOUT
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
    if (!isolate.isDisposed) {
      isolate.dispose()
    }
  }
}
