import { FunctionErrorCode } from "@budibase/types"
import type {
  FunctionRunRequest,
  FunctionRunResult,
  JSONValue,
} from "@budibase/types"
import { z } from "zod"

const MALFORMED_REQUEST_MESSAGE = "Malformed Function run request"
const MALFORMED_RESULT_MESSAGE = "Malformed Function run result"

export class FunctionProtocolError extends Error {
  readonly code = FunctionErrorCode.FUNCTION_PROTOCOL_ERROR

  constructor(message: string) {
    super(message)
    this.name = "FunctionProtocolError"
  }
}

const jsonPrimitiveSchema = z.union([
  z.string(),
  z.number(),
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

const functionArtifactSchema = z
  .object({
    compiledJavaScript: z.string(),
    sourceMap: z.string().optional(),
    sourceHash: z.string().min(1),
    declarationsHash: z.string().min(1),
    compiledAt: z.string().min(1),
  })
  .strict()

const nonNegativeIntegerSchema = z.number().int().nonnegative()

const functionRunLimitsSchema = z
  .object({
    maxInputBytes: nonNegativeIntegerSchema,
    maxInputDepth: nonNegativeIntegerSchema,
    isolateMemoryLimitMb: nonNegativeIntegerSchema,
    timeoutMs: nonNegativeIntegerSchema,
    maxQueryCalls: nonNegativeIntegerSchema,
    maxConcurrentQueryCalls: nonNegativeIntegerSchema,
    maxQueryResponseBytes: nonNegativeIntegerSchema,
    maxQueryResponseDepth: nonNegativeIntegerSchema,
    maxOutputBytes: nonNegativeIntegerSchema,
    maxOutputDepth: nonNegativeIntegerSchema,
    maxLogEntries: nonNegativeIntegerSchema,
    maxLogBytes: nonNegativeIntegerSchema,
    maxLogEntryBytes: nonNegativeIntegerSchema,
  })
  .strict()

const functionLogEntrySchema = z
  .object({
    level: z.enum(["debug", "info", "warn", "error"]),
    message: z.string(),
    timestamp: z.string().min(1),
  })
  .strict()

const functionRunMetricsSchema = z
  .object({
    durationMs: z.number().nonnegative(),
    queryCount: z.number().nonnegative(),
    outputBytes: z.number().nonnegative(),
    logBytes: z.number().nonnegative(),
  })
  .strict()

const functionErrorSchema = z
  .object({
    code: z.enum(FunctionErrorCode),
    message: z.string(),
    line: z.number().nonnegative().optional(),
    column: z.number().nonnegative().optional(),
  })
  .strict()

const functionRunRequestSchema: z.ZodType<FunctionRunRequest> = z
  .object({
    runId: z.string().min(1),
    artifact: functionArtifactSchema,
    inputs: jsonRecordSchema,
    grantToken: z.string().min(1),
    limits: functionRunLimitsSchema,
  })
  .strict()

const functionRunResultSchema: z.ZodType<FunctionRunResult> = z
  .object({
    runId: z.string().min(1),
    status: z.enum(["success", "error", "stopped"]),
    output: jsonRecordSchema.optional(),
    logs: z.array(functionLogEntrySchema).optional(),
    metrics: functionRunMetricsSchema,
    error: functionErrorSchema.optional(),
  })
  .strict()

const validate = <T>(
  schema: z.ZodType<T>,
  value: unknown,
  malformedMessage: string
): T => {
  try {
    return schema.parse(value)
  } catch {
    throw new FunctionProtocolError(malformedMessage)
  }
}

const decodeJSON = (payload: string, malformedMessage: string): unknown => {
  try {
    return JSON.parse(payload)
  } catch {
    throw new FunctionProtocolError(malformedMessage)
  }
}

export const validateFunctionRunRequest = (
  value: unknown
): FunctionRunRequest =>
  validate(functionRunRequestSchema, value, MALFORMED_REQUEST_MESSAGE)

export const validateFunctionRunResult = (value: unknown): FunctionRunResult =>
  validate(functionRunResultSchema, value, MALFORMED_RESULT_MESSAGE)

export const parseFunctionRunRequest = (payload: string) =>
  validateFunctionRunRequest(decodeJSON(payload, MALFORMED_REQUEST_MESSAGE))

export const parseFunctionRunResult = (payload: string) =>
  validateFunctionRunResult(decodeJSON(payload, MALFORMED_RESULT_MESSAGE))
