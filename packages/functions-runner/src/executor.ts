import { clamp, RunnerConfig } from "./config"
import { runInIsolate } from "./isolate"
import type { ExecuteRequest, ExecuteResponse } from "./protocol"

// Bridges the wire protocol to the isolate: validates and clamps limits, times
// the run, and always produces a well-formed ExecuteResponse.
export const execute = async (
  request: ExecuteRequest,
  config: RunnerConfig
): Promise<ExecuteResponse> => {
  const start = Date.now()
  const timeoutMs = clamp(
    request.limits?.timeoutMs ?? config.defaultTimeoutMs,
    1,
    config.maxTimeoutMs
  )
  const memoryMb = clamp(
    request.limits?.memoryMb ?? config.defaultMemoryMb,
    8,
    config.maxMemoryMb
  )

  const outcome = await runInIsolate({
    code: request.code,
    input: request.input ?? null,
    timeoutMs,
    memoryMb,
  })

  return {
    id: request.id,
    status: outcome.status,
    result: outcome.result,
    error: outcome.error,
    durationMs: Date.now() - start,
  }
}
