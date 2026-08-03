import { FunctionErrorCode } from "@budibase/types"
import type {
  FunctionExecutor,
  FunctionExecutorHealth,
  FunctionRunRequest,
  FunctionRunResult,
} from "@budibase/types"
import env from "../../environment"
import { FunctionExecutionError } from "../errors"
import { parseFunctionRunResult } from "./protocol"

const HEALTH_TIMEOUT_MS = 2_000
const TERMINATE_TIMEOUT_MS = 2_000
const MAX_HEALTH_RESPONSE_BYTES = 16 * 1024
const RESPONSE_ENVELOPE_BYTES = 64 * 1024

type Fetch = typeof fetch

interface LocalRunnerFunctionExecutorOptions {
  baseUrl?: string
  fetch?: Fetch
}

const discardBody = async (response: Response) => {
  try {
    await response.body?.cancel()
  } catch {
    // Response bodies are never authoritative for transport status errors.
  }
}

const readBoundedBody = async (response: Response, maxBytes: number) => {
  if (!response.body) {
    return ""
  }

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let totalBytes = 0

  try {
    let result = await reader.read()
    while (!result.done) {
      totalBytes += result.value.byteLength
      if (totalBytes > maxBytes) {
        await reader.cancel()
        throw new FunctionExecutionError(
          FunctionErrorCode.FUNCTION_PROTOCOL_ERROR
        )
      }
      chunks.push(result.value)
      result = await reader.read()
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

export class LocalRunnerFunctionExecutor implements FunctionExecutor {
  private readonly baseUrl?: string
  private readonly fetch: Fetch

  constructor(options: LocalRunnerFunctionExecutorOptions = {}) {
    this.baseUrl = options.baseUrl ?? env.FUNCTIONS_RUNNER_URL
    this.fetch = options.fetch ?? globalThis.fetch
  }

  private getUrl(path: string) {
    if (!this.baseUrl) {
      throw new FunctionExecutionError(
        FunctionErrorCode.FUNCTION_RUNNER_UNAVAILABLE
      )
    }
    return new URL(path, `${this.baseUrl.replace(/\/+$/, "")}/`)
  }

  private async request<T>(
    path: string,
    init: RequestInit,
    timeoutMs: number,
    timeoutCode: FunctionErrorCode,
    handleResponse: (response: Response) => Promise<T>
  ): Promise<T> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await this.fetch(this.getUrl(path), {
        ...init,
        signal: controller.signal,
      })
      return await handleResponse(response)
    } catch (error) {
      if (error instanceof FunctionExecutionError) {
        throw error
      }
      if (controller.signal.aborted) {
        throw new FunctionExecutionError(timeoutCode)
      }
      throw new FunctionExecutionError(
        FunctionErrorCode.FUNCTION_RUNNER_UNAVAILABLE
      )
    } finally {
      clearTimeout(timeout)
    }
  }

  async health(): Promise<FunctionExecutorHealth> {
    try {
      return await this.request(
        "health",
        { method: "GET" },
        HEALTH_TIMEOUT_MS,
        FunctionErrorCode.FUNCTION_RUNNER_UNAVAILABLE,
        async response => {
          if (!response.ok) {
            await discardBody(response)
            return { healthy: false }
          }

          const payload = JSON.parse(
            await readBoundedBody(response, MAX_HEALTH_RESPONSE_BYTES)
          )
          if (payload?.healthy !== true) {
            return { healthy: false }
          }

          return {
            healthy: true,
          }
        }
      )
    } catch {
      return { healthy: false }
    }
  }

  async execute(request: FunctionRunRequest): Promise<FunctionRunResult> {
    try {
      return await this.request(
        "runs",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(request),
        },
        request.limits.timeoutMs,
        FunctionErrorCode.FUNCTION_TIMEOUT,
        async response => {
          if (response.status === 429) {
            await discardBody(response)
            throw new FunctionExecutionError(
              FunctionErrorCode.FUNCTION_RUNNER_BUSY
            )
          }
          if (response.status === 400 || response.status === 409) {
            await discardBody(response)
            throw new FunctionExecutionError(
              FunctionErrorCode.FUNCTION_PROTOCOL_ERROR
            )
          }
          if (!response.ok) {
            await discardBody(response)
            throw new FunctionExecutionError(
              FunctionErrorCode.FUNCTION_RUNNER_UNAVAILABLE
            )
          }

          const result = parseFunctionRunResult(
            await readBoundedBody(
              response,
              request.limits.maxOutputBytes +
                request.limits.maxLogBytes +
                RESPONSE_ENVELOPE_BYTES
            )
          )
          if (result.runId !== request.runId) {
            throw new FunctionExecutionError(
              FunctionErrorCode.FUNCTION_PROTOCOL_ERROR
            )
          }
          return result
        }
      )
    } catch (error) {
      if (
        error instanceof FunctionExecutionError &&
        error.code === FunctionErrorCode.FUNCTION_TIMEOUT
      ) {
        try {
          await this.terminate(request.runId)
        } catch {
          // The original timeout remains the authoritative failure.
        }
      }
      throw error
    }
  }

  async terminate(runId: string): Promise<void> {
    await this.request(
      `runs/${encodeURIComponent(runId)}`,
      { method: "DELETE" },
      TERMINATE_TIMEOUT_MS,
      FunctionErrorCode.FUNCTION_RUNNER_UNAVAILABLE,
      async response => {
        await discardBody(response)
        if (!response.ok && response.status !== 404) {
          throw new FunctionExecutionError(
            FunctionErrorCode.FUNCTION_RUNNER_UNAVAILABLE
          )
        }
      }
    )
  }
}
