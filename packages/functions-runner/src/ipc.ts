import type {
  FunctionRunRequest,
  FunctionRunResult,
  JSONValue,
} from "@budibase/types"
import { z } from "zod"
import {
  jsonRecordSchema,
  jsonValueSchema,
  validateFunctionRunRequest,
  validateFunctionRunResult,
} from "./protocol"

const parentMessageSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("run"), request: z.unknown() }).strict(),
  z
    .object({
      type: z.literal("queryResult"),
      requestId: z.string().min(1),
      result: jsonValueSchema.optional(),
      error: z.string().min(1).optional(),
    })
    .strict(),
])

const childMessageSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("result"), result: z.unknown() }).strict(),
  z
    .object({
      type: z.literal("query"),
      requestId: z.string().min(1),
      capabilityId: z.string().min(1),
      parameters: jsonRecordSchema,
    })
    .strict(),
])

export type ParentMessage =
  | { type: "run"; request: FunctionRunRequest }
  | {
      type: "queryResult"
      requestId: string
      result?: JSONValue
      error?: string
    }

export type ChildMessage =
  | { type: "result"; result: FunctionRunResult }
  | {
      type: "query"
      requestId: string
      capabilityId: string
      parameters: Record<string, JSONValue>
    }

export const validateParentMessage = (value: unknown): ParentMessage => {
  const message = parentMessageSchema.parse(value)
  if (message.type === "run") {
    return {
      type: "run",
      request: validateFunctionRunRequest(message.request),
    }
  }
  if (message.error && message.result === undefined) {
    return {
      type: "queryResult",
      requestId: message.requestId,
      error: message.error,
    }
  }
  if (!message.error && message.result !== undefined) {
    return {
      type: "queryResult",
      requestId: message.requestId,
      result: message.result,
    }
  }
  throw new Error("Invalid query result message")
}

export const validateChildMessage = (value: unknown): ChildMessage => {
  const message = childMessageSchema.parse(value)
  if (message.type === "result") {
    return {
      type: "result",
      result: validateFunctionRunResult(message.result),
    }
  }
  return message
}
