import type { FunctionRunnerStatus } from "@budibase/types"
import env from "../environment"

const HEALTH_TIMEOUT_MS = 2_000
const MAX_HEALTH_RESPONSE_BYTES = 16 * 1024

type Fetch = typeof fetch

interface FunctionRunnerStatusOptions {
  baseUrl?: string
  fetch?: Fetch
}

const discardBody = async (response: Response) => {
  try {
    await response.body?.cancel()
  } catch {
    // The response body is not authoritative for runner transport status.
  }
}

const readBoundedBody = async (response: Response) => {
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
      if (totalBytes > MAX_HEALTH_RESPONSE_BYTES) {
        await reader.cancel()
        throw new Error("Function runner health response is too large")
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

export const getFunctionRunnerStatus = async (
  options: FunctionRunnerStatusOptions = {}
): Promise<FunctionRunnerStatus> => {
  const baseUrl = options.baseUrl ?? env.FUNCTIONS_RUNNER_URL
  if (!baseUrl) {
    return "disabled"
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS)
  try {
    const response = await (options.fetch ?? globalThis.fetch)(
      new URL("health", `${baseUrl.replace(/\/+$/, "")}/`),
      { signal: controller.signal }
    )
    if (response.status === 429) {
      await discardBody(response)
      return "busy"
    }
    if (!response.ok) {
      await discardBody(response)
      return "unhealthy"
    }

    const payload: unknown = JSON.parse(await readBoundedBody(response))
    if (!payload || typeof payload !== "object") {
      return "unhealthy"
    }
    if ("busy" in payload && payload.busy === true) {
      return "busy"
    }
    return "healthy" in payload && payload.healthy === true
      ? "healthy"
      : "unhealthy"
  } catch {
    return "unhealthy"
  } finally {
    clearTimeout(timeout)
  }
}
