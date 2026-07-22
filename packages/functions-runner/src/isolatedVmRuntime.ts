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

const createFailure = (
  request: FunctionRunRequest,
  startedAt: number,
  queryCount: number,
  outputError: boolean
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
    code: outputError
      ? FunctionErrorCode.FUNCTION_OUTPUT_INVALID
      : FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
    message: outputError ? INVALID_OUTPUT_MESSAGE : RUNTIME_ERROR_MESSAGE,
  },
})

export const executeFunctionInIsolate = async (
  request: FunctionRunRequest,
  queryHandler: FunctionQueryHandler
): Promise<FunctionRunResult> => {
  const startedAt = Date.now()
  let queryCount = 0
  let outputError = false
  let isolate: ivm.Isolate
  try {
    isolate = new ivm.Isolate({
      memoryLimit: request.limits.isolateMemoryLimitMb,
    })
  } catch {
    return createFailure(request, startedAt, queryCount, false)
  }

  try {
    const context = await isolate.createContext()
    const queryReference = new ivm.Reference(
      async (capabilityIdValue: unknown, parametersValue: unknown) => {
        if (typeof capabilityIdValue !== "string" || !capabilityIdValue) {
          throw new FunctionOutputError(INVALID_QUERY_MESSAGE)
        }
        const { normalized: parameters } = normalizeRecord(
          parametersValue,
          request.limits.maxInputDepth,
          request.limits.maxInputBytes,
          INVALID_QUERY_MESSAGE
        )
        queryCount += 1
        const result = await queryHandler({
          runId: request.runId,
          grantToken: request.grantToken,
          capabilityId: capabilityIdValue,
          parameters,
        })
        return normalizeValue(
          result,
          request.limits.maxQueryResponseDepth,
          request.limits.maxQueryResponseBytes,
          INVALID_QUERY_MESSAGE
        ).normalized
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
            outputError = true
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
    if (error instanceof FunctionOutputError) {
      outputError = true
    }
    return createFailure(request, startedAt, queryCount, outputError)
  } finally {
    isolate.dispose()
  }
}
