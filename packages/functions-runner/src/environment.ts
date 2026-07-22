const DEFAULT_PORT = 4007

const parsePort = (value: string | undefined) => {
  if (!value) {
    return DEFAULT_PORT
  }

  const port = Number(value)
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("FUNCTIONS_RUNNER_PORT must be an integer from 1 to 65535")
  }

  return port
}

export interface FunctionsRunnerEnvironment {
  host: string
  port: number
}

export const getEnvironment = (): FunctionsRunnerEnvironment => ({
  host: process.env.FUNCTIONS_RUNNER_HOST || "0.0.0.0",
  port: parsePort(process.env.FUNCTIONS_RUNNER_PORT || process.env.PORT),
})
