import path from "node:path"

if (process.env.NODE_ENV !== "production" && !process.env.JEST_WORKER_ID) {
  const topLevelPath =
    process.env.TOP_LEVEL_PATH || path.resolve(__dirname, "..", "..", "..")
  require("dotenv").config({ path: path.join(topLevelPath, ".env") })
}

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
  brokerUrl: string
  host: string
  port: number
  terminationGraceMs: number
}

export const getEnvironment = (): FunctionsRunnerEnvironment => {
  if (!process.env.FUNCTIONS_BROKER_URL) {
    throw new Error("FUNCTIONS_BROKER_URL is required")
  }

  return {
    brokerUrl: process.env.FUNCTIONS_BROKER_URL,
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
  }
}
