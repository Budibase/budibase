import { FunctionErrorCode } from "@budibase/types"
import type { FunctionRunResult, JSONValue } from "@budibase/types"
import { z } from "zod"
import { FunctionExecutionError } from "../errors"

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

const nonNegativeNumberSchema = z.number().nonnegative()

const resultSchema: z.ZodType<FunctionRunResult> = z
  .object({
    runId: z.string().min(1),
    status: z.enum(["success", "error", "stopped"]),
    output: z.record(z.string(), jsonValueSchema).optional(),
    logs: z
      .array(
        z
          .object({
            level: z.enum(["debug", "info", "warn", "error"]),
            message: z.string(),
            timestamp: z.string().min(1),
          })
          .strict()
      )
      .optional(),
    metrics: z
      .object({
        durationMs: nonNegativeNumberSchema,
        queryCount: nonNegativeNumberSchema,
        outputBytes: nonNegativeNumberSchema,
        logBytes: nonNegativeNumberSchema,
      })
      .strict(),
    error: z
      .object({
        code: z.enum(FunctionErrorCode),
        message: z.string(),
        line: nonNegativeNumberSchema.optional(),
        column: nonNegativeNumberSchema.optional(),
      })
      .strict()
      .optional(),
  })
  .strict()

export const parseFunctionRunResult = (payload: string) => {
  try {
    return resultSchema.parse(JSON.parse(payload))
  } catch {
    throw new FunctionExecutionError(FunctionErrorCode.FUNCTION_PROTOCOL_ERROR)
  }
}
