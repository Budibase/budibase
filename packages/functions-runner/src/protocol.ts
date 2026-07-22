export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

export interface ExecuteLimits {
  // Wall-clock limit for a single execution, in milliseconds.
  timeoutMs?: number
  // Hard memory ceiling for the isolate, in megabytes.
  memoryMb?: number
}

export interface ExecuteRequest {
  // Correlation id echoed back on the response.
  id: string
  // Function source. The body has access to an `input` binding and must
  // `return` a JSON-serialisable value.
  code: string
  input?: JsonValue
  limits?: ExecuteLimits
}

export type ExecuteStatus = "ok" | "error" | "timeout"

export interface ExecuteError {
  name: string
  message: string
}

export interface ExecuteResponse {
  id: string
  status: ExecuteStatus
  result?: JsonValue
  error?: ExecuteError
  durationMs: number
}

export interface HealthResponse {
  status: "ok"
  service: "functions-runner"
  uptimeSeconds: number
  isolatedVm: boolean
}

// A protocol fixture used by health/smoke checks and tests: it must execute
// end-to-end through the isolate and return a deterministic value.
export const PROTOCOL_FIXTURE: ExecuteRequest = {
  id: "protocol-fixture",
  code: "return { echo: input, ok: true, sum: input.a + input.b }",
  input: { a: 2, b: 3 },
}

export const PROTOCOL_FIXTURE_EXPECTED: JsonValue = {
  echo: { a: 2, b: 3 },
  ok: true,
  sum: 5,
}
