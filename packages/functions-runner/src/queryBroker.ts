import { DEFAULT_FUNCTION_LIMITS } from "@budibase/types"
import type {
  FunctionQueryBrokerRequest,
  FunctionQueryBrokerResponse,
} from "@budibase/types"
import { z } from "zod"
import type { FunctionQueryHandler } from "./isolatedVmRuntime"
import { jsonValueSchema } from "./protocol"

const QUERY_PATH = "/api/internal/functions/query"
const DEFAULT_TIMEOUT_MS = DEFAULT_FUNCTION_LIMITS.run.timeoutMs
const DEFAULT_MAX_RESPONSE_BYTES =
  DEFAULT_FUNCTION_LIMITS.run.maxQueryResponseBytes + 1024

export type FunctionQueryBrokerFailure =
  | "cancelled"
  | "denied"
  | "invalid_response"
  | "limit"
  | "timeout"
  | "unavailable"

const FAILURE_MESSAGES: Record<FunctionQueryBrokerFailure, string> = {
  cancelled: "Function query request was cancelled",
  denied: "Function query request was denied",
  invalid_response: "Function query broker returned an invalid response",
  limit: "Function query request exceeded a limit",
  timeout: "Function query request timed out",
  unavailable: "Function query broker is unavailable",
}

export class FunctionQueryBrokerError extends Error {
  constructor(readonly failure: FunctionQueryBrokerFailure) {
    super(FAILURE_MESSAGES[failure])
    this.name = "FunctionQueryBrokerError"
  }
}

export interface FunctionQueryBrokerOptions {
  baseUrl: string
  fetch?: typeof fetch
  maxResponseBytes?: number
  timeoutMs?: number
}

const parametersSchema = z.record(z.string(), z.union([z.string(), z.null()]))

const responseSchema: z.ZodType<FunctionQueryBrokerResponse> = z
  .object({ data: jsonValueSchema })
  .strict()

const getBrokerUrl = (baseUrl: string) => {
  let url: URL
  try {
    url = new URL(baseUrl)
  } catch {
    throw new Error("FUNCTIONS_BROKER_URL must be a valid URL")
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error("FUNCTIONS_BROKER_URL must be an HTTP origin")
  }
  return new URL(QUERY_PATH, url.origin).toString()
}

const readBoundedBody = async (response: Response, maxBytes: number) => {
  const contentLength = response.headers.get("content-length")
  if (contentLength && Number(contentLength) > maxBytes) {
    throw new FunctionQueryBrokerError("invalid_response")
  }
  if (!response.body) {
    throw new FunctionQueryBrokerError("invalid_response")
  }

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let totalBytes = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      totalBytes += value.byteLength
      if (totalBytes > maxBytes) {
        await reader.cancel()
        throw new FunctionQueryBrokerError("invalid_response")
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  const body = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(body)
}

const decodeResponse = async (response: Response, maxBytes: number) => {
  let value: unknown
  try {
    value = JSON.parse(await readBoundedBody(response, maxBytes))
  } catch (error) {
    if (error instanceof FunctionQueryBrokerError) {
      throw error
    }
    throw new FunctionQueryBrokerError("invalid_response")
  }

  const parsed = responseSchema.safeParse(value)
  if (!parsed.success) {
    throw new FunctionQueryBrokerError("invalid_response")
  }
  return parsed.data.data
}

const getFailureForStatus = (status: number): FunctionQueryBrokerFailure => {
  if (status === 403) {
    return "denied"
  }
  if (status === 429) {
    return "limit"
  }
  return "unavailable"
}

export const createFunctionQueryBroker = ({
  baseUrl,
  fetch: request = globalThis.fetch,
  maxResponseBytes = DEFAULT_MAX_RESPONSE_BYTES,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: FunctionQueryBrokerOptions): FunctionQueryHandler => {
  const url = getBrokerUrl(baseUrl)

  return async ({ runId, grantToken, capabilityId, parameters, signal }) => {
    const parsedParameters = parametersSchema.safeParse(parameters)
    if (!parsedParameters.success) {
      throw new FunctionQueryBrokerError("denied")
    }

    const body: FunctionQueryBrokerRequest = {
      runId,
      grantToken,
      capabilityId,
      parameters: parsedParameters.data,
    }
    const requestAbortController = new AbortController()
    let timedOut = false
    const abortRequest = () => requestAbortController.abort()
    const timeout = setTimeout(() => {
      timedOut = true
      requestAbortController.abort()
    }, timeoutMs)
    timeout.unref()
    signal.addEventListener("abort", abortRequest, { once: true })
    if (signal.aborted) {
      abortRequest()
    }

    try {
      const response = await request(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        redirect: "error",
        signal: requestAbortController.signal,
      })
      if (!response.ok) {
        throw new FunctionQueryBrokerError(getFailureForStatus(response.status))
      }
      return await decodeResponse(response, maxResponseBytes)
    } catch (error) {
      if (signal.aborted) {
        throw new FunctionQueryBrokerError("cancelled")
      }
      if (timedOut) {
        throw new FunctionQueryBrokerError("timeout")
      }
      if (error instanceof FunctionQueryBrokerError) {
        throw error
      }
      throw new FunctionQueryBrokerError("unavailable")
    } finally {
      clearTimeout(timeout)
      signal.removeEventListener("abort", abortRequest)
    }
  }
}
