const num = (value: string | undefined, fallback: number): number => {
  const parsed = value !== undefined ? Number(value) : NaN
  return Number.isFinite(parsed) ? parsed : fallback
}

export interface RunnerConfig {
  host: string
  port: number
  defaultTimeoutMs: number
  maxTimeoutMs: number
  defaultMemoryMb: number
  maxMemoryMb: number
  maxBodyBytes: number
}

export const loadConfig = (env: NodeJS.ProcessEnv = process.env): RunnerConfig => ({
  host: env.FUNCTIONS_RUNNER_HOST || "0.0.0.0",
  port: num(env.FUNCTIONS_RUNNER_PORT, 4008),
  defaultTimeoutMs: num(env.FUNCTIONS_RUNNER_DEFAULT_TIMEOUT_MS, 5000),
  maxTimeoutMs: num(env.FUNCTIONS_RUNNER_MAX_TIMEOUT_MS, 30000),
  defaultMemoryMb: num(env.FUNCTIONS_RUNNER_DEFAULT_MEMORY_MB, 64),
  maxMemoryMb: num(env.FUNCTIONS_RUNNER_MAX_MEMORY_MB, 128),
  maxBodyBytes: num(env.FUNCTIONS_RUNNER_MAX_BODY_BYTES, 512 * 1024),
})

// Clamp a caller-supplied limit into the runner's configured bounds.
export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))
