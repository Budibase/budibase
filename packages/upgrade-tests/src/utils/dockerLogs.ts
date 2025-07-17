import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export interface DockerLogEntry {
  timestamp: string
  message: string
  level?: string
  requestId?: string
  [key: string]: any // Allow additional fields
}

export async function getDockerLogs(requestId?: string): Promise<string[]> {
  const containerName = getContainerName()
  try {
    // It can take a moment for logs to be available through `docker logs`
    // after an error happens.
    await new Promise(resolve => setTimeout(resolve, 1000))
    const { stdout } = await execAsync(
      `docker logs ${containerName} --since 20s`
    )

    const lines = stdout.split("\n").filter(line => line.trim())

    if (!requestId) {
      return lines
    }

    if (process.env.DEBUG_LOGS === "true") {
      console.log(
        `\nSearching for correlationId ${requestId} in ${lines.length} log lines...`
      )
    }

    // Filter logs by request ID (correlationId)
    const relevantLogs: string[] = []

    for (const line of lines) {
      if (!line.trim()) continue

      // Try to extract JSON from the line
      // Docker logs might have prefixes like timestamps or stream identifiers
      let jsonStr = line

      // Common patterns to extract JSON from log lines
      const jsonMatch = line.match(/(\{.+\})\s*$/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1]
      }

      try {
        // Parse as JSON - we only want JSON logs with matching correlationId
        const parsed = JSON.parse(jsonStr)

        // Check if this log entry contains our request ID as correlationId
        // The correlationId can be in multiple places:
        // - parsed.req.correlationId (for request logs)
        // - parsed.correlationId (for error/warn logs)
        const hasCorrelationId =
          parsed.req?.correlationId === requestId ||
          parsed.correlationId === requestId

        if (hasCorrelationId) {
          relevantLogs.push(line)
          if (process.env.DEBUG_LOGS === "true") {
            console.log(
              `Found log with correlationId! Level: ${parsed.level}, Message: ${parsed.msg}`
            )
          }
        }

        // Extra debug: log when we find a JSON log but it doesn't match
        if (
          process.env.DEBUG_LOGS === "true" &&
          parsed.correlationId &&
          parsed.correlationId !== requestId
        ) {
          console.log(
            `Found JSON log with different correlationId: ${parsed.correlationId} (looking for ${requestId})`
          )
        }
      } catch (e) {
        // Debug: log parsing failures if in verbose mode
        if (process.env.DEBUG_LOGS === "true") {
          console.error(
            `Failed to parse log line: ${line.substring(0, 100)}...`
          )
        }
      }
    }

    return relevantLogs
  } catch (error) {
    console.error("Failed to fetch Docker logs:", error)
    return []
  }
}

export async function parseStructuredLogs(
  requestId?: string
): Promise<DockerLogEntry[]> {
  const logs = await getDockerLogs(requestId)
  const entries: DockerLogEntry[] = []

  for (const line of logs) {
    if (!line.trim()) continue

    // Try to extract JSON from the line
    let jsonStr = line

    // Common patterns to extract JSON from log lines
    const jsonMatch = line.match(/(\{.+\})\s*$/)
    if (jsonMatch) {
      jsonStr = jsonMatch[1]
    }

    try {
      // Parse as JSON (structured logs)
      const parsed = JSON.parse(jsonStr)

      // Create a normalized log entry with all fields
      const entry: DockerLogEntry = {
        timestamp:
          parsed.timestamp ||
          parsed.time ||
          parsed.ts ||
          new Date().toISOString(),
        message: parsed.msg || parsed.message || parsed.m || "No message",
        level: parsed.level || parsed.severity || parsed.lvl || parsed.l,
        requestId: parsed.req?.correlationId || parsed.correlationId,
      }

      // Copy all other fields from the parsed log
      Object.keys(parsed).forEach(key => {
        if (
          ![
            "timestamp",
            "time",
            "ts",
            "msg",
            "message",
            "m",
            "level",
            "severity",
            "lvl",
            "l",
          ].includes(key)
        ) {
          entry[key] = parsed[key]
        }
      })

      entries.push(entry)
    } catch {
      // Fallback for non-JSON logs - only if somehow a non-JSON line got through
      // This should be rare since getDockerLogs already filters
      entries.push({
        timestamp: new Date().toISOString(),
        message: line,
        level: "INFO",
      })
    }
  }

  return entries
}

export function formatLogEntry(entry: DockerLogEntry, indent = ""): string {
  const levelColors: Record<string, string> = {
    ERROR: "\x1b[31m", // Red
    WARN: "\x1b[33m", // Yellow
    INFO: "\x1b[36m", // Cyan
    DEBUG: "\x1b[90m", // Gray
  }
  const reset = "\x1b[0m"

  const level = entry.level?.toUpperCase() || "INFO"
  const color = levelColors[level] || ""

  // Format timestamp to be more readable
  const date = new Date(entry.timestamp)
  const timestamp =
    date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) +
    "." +
    date.getMilliseconds().toString().padStart(3, "0")

  let formatted = `${indent}[${timestamp}] ${color}${level.padEnd(5)}${reset} ${entry.message}`

  // Add additional context if available
  const context: string[] = []

  // Add request info if available
  if (entry.req && typeof entry.req === "object") {
    const req = entry.req as any
    if (req.method) context.push(`method=${req.method}`)
    if (req.url) context.push(`url=${req.url}`)
  }

  // Add response info if available
  if (entry.res && typeof entry.res === "object") {
    const res = entry.res as any
    if (res.status) context.push(`status=${res.status}`)
  }

  // Add response time if available
  if (entry.responseTime !== undefined) {
    context.push(`duration=${entry.responseTime}ms`)
  }

  // Add other relevant fields
  const additionalFields = [
    "service",
    "endpoint",
    "statusCode",
    "duration",
    "error",
  ]
  for (const field of additionalFields) {
    if (entry[field] && typeof entry[field] !== "object") {
      context.push(`${field}=${entry[field]}`)
    }
  }

  if (context.length > 0) {
    formatted += ` (${context.join(", ")})`
  }

  // Check for stack trace in various locations
  const stack = entry.stack || entry.error?.stack || entry.err?.stack
  if (stack && typeof stack === "string") {
    formatted += "\n" + formatStackTrace(stack, indent + "         ")
  }

  // Check for error object with more details
  const errorObj = entry.error || entry.err
  if (errorObj && typeof errorObj === "object" && !stack) {
    const errorDetails: string[] = []
    if (errorObj.message) errorDetails.push(`message: ${errorObj.message}`)
    if (errorObj.code) errorDetails.push(`code: ${errorObj.code}`)
    if (errorObj.type) errorDetails.push(`type: ${errorObj.type}`)

    if (errorDetails.length > 0) {
      formatted += `\n${indent}         Error details: ${errorDetails.join(", ")}`
    }
  }

  return formatted
}

export function formatStackTrace(stack: string, indent = ""): string {
  const lines = stack.split("\n")
  const formatted: string[] = []

  // Style for stack trace
  const dim = "\x1b[90m" // Gray/dim
  const reset = "\x1b[0m"
  const highlight = "\x1b[33m" // Yellow for file paths

  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (!trimmed) return

    // First line is usually the error message
    if (index === 0) {
      formatted.push(`${indent}${dim}Stack: ${trimmed}${reset}`)
      return
    }

    // Format stack frames
    // Match patterns like "at Function.name (file:line:col)" or "at file:line:col"
    const frameMatch = trimmed.match(
      /^at\s+(?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?$/
    )
    if (frameMatch) {
      const [, functionName, file, line, col] = frameMatch
      const fileName = file.split("/").pop() || file

      if (functionName) {
        formatted.push(
          `${indent}${dim}  at ${functionName} ${highlight}(${fileName}:${line}:${col})${reset}`
        )
      } else {
        formatted.push(
          `${indent}${dim}  at ${highlight}${fileName}:${line}:${col}${reset}`
        )
      }
    } else {
      // Fallback for other formats
      formatted.push(`${indent}${dim}  ${trimmed}${reset}`)
    }
  })

  return formatted.join("\n")
}

// Get the container name based on test phase
export function getContainerName(): string {
  const containerName = process.env.BUDIBASE_CONTAINER_NAME
  if (!containerName) {
    throw new Error("BUDIBASE_CONTAINER_NAME environment variable is required")
  }
  return containerName
}
