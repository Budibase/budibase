const DEFAULT_PORT = 4007
const DEFAULT_TERMINATION_GRACE_MS = 250

const parseInteger = (
  value: string | undefined,
  fallback: number,
  name: string,
  minimum: number,
  maximum: number
) => {
  if (!value) {
    return fallback
  }

  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(`${name} must be an integer from ${minimum} to ${maximum}`)
  }

  return parsed
}

export interface FunctionsRunnerEnvironment {
  host: string
  port: number
  terminationGraceMs: number
}

export const getEnvironment = (): FunctionsRunnerEnvironment => ({
  host: process.env.FUNCTIONS_RUNNER_HOST || "0.0.0.0",
  port: parseInteger(
    process.env.FUNCTIONS_RUNNER_PORT || process.env.PORT,
    DEFAULT_PORT,
    "FUNCTIONS_RUNNER_PORT",
    1,
    65_535
  ),
  terminationGraceMs: parseInteger(
    process.env.FUNCTIONS_RUNNER_TERMINATION_GRACE_MS,
    DEFAULT_TERMINATION_GRACE_MS,
    "FUNCTIONS_RUNNER_TERMINATION_GRACE_MS",
    0,
    60_000
  ),
})
