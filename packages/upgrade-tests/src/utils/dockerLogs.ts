import { exec } from "child_process"
import { promisify } from "util"
import { red, yellow, cyan, gray, blue, green } from "chalk"

const execAsync = promisify(exec)

export interface LogEntryError {
  type: string
  message: string
  stack: string
  code?: string
  status: number
}

export interface LogEntry {
  timestamp: string
  service: string
  message: string
  level: string
  correlationId: string
  method: string
  url: string
  status: number
  responseTime: number
  error?: LogEntryError
}

function extractJSON(line: string): Record<string, any> | null {
  try {
    return JSON.parse(line)
  } catch (e) {
    return null
  }
}

export async function getLogsForRequest(
  requestId: string
): Promise<LogEntry[]> {
  // It can take a moment for logs to be available through `docker logs`
  // after an error happens.
  await new Promise(resolve => setTimeout(resolve, 1000))

  const { stdout } = await execAsync(
    `docker logs ${getContainerName()} --since 20s`
  )
  const lines = stdout.split("\n").filter(line => line.trim())
  const logs: LogEntry[] = []
  for (let line of lines) {
    const json = extractJSON(line)
    if (!json) {
      continue
    }

    // Check for correlationId in both req object and root level. This is
    // necessary because it shows up in different places depending on whether
    // the log is from a request or an error.
    const correlationId = json?.req?.correlationId || json?.correlationId
    if (correlationId !== requestId) {
      continue
    }

    // Example log message:
    //
    // {
    //   level: "INFO",
    //   timestamp: "2025-07-17T15:48:46.060Z",
    //   service: "@budibase/server",
    //   req: {
    //     method: "GET",
    //     url: "/",
    //     correlationId: "36014e1d-7cf1-48c5-a7e7-ff94f0358adb",
    //   },
    //   res: { status: 301 },
    //   responseTime: 1,
    //   msg: "request completed",
    // }
    //
    // Example error log message:
    //
    // {
    //   level: "ERROR",
    //   timestamp: "2025-07-17T16:31:02.628Z",
    //   service: "@budibase/server",
    //   err: {
    //     type: "_HTTPError",
    //     message: "Oh no",
    //     stack:
    //       "Error: Oh no\n    at fetch29 (/app/dist/index.js:191608:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)\n    at async middleware3 (/app/dist/index.js:171453:20)\n    at async contentSecurityPolicy (/app/dist/index.js:143284:7)\n    at async /node_modules/koa-compress/lib/index.js:38:5\n    at async /app/dist/index.js:143302:9\n    at async doInFeatureFlagOverrideContext (/app/dist/index.js:36955:10)\n    at async featureFlagCookie_default (/app/dist/index.js:143301:7)\n    at async errorHandling (/app/dist/index.js:143088:5)\n    at async /node_modules/koa-mount/index.js:52:26\n    at async userAgent (/node_modules/koa-useragent/dist/index.js:12:5)\n    at async ip_default (/app/dist/index.js:143368:16)",
    //     code: "http",
    //     status: 500,
    //   },
    //   pid: 328,
    //   tenantId: "default",
    //   correlationId: "3d5a4f13-3602-4325-902e-55178b4e5de4",
    //   msg: "Got 400 response code",
    // }
    let error: LogEntryError | undefined
    if (json.err) {
      error = {
        type: json.err.type,
        message: json.err.message,
        stack: json.err.stack,
        code: json.err.code,
        status: json.err.status,
      }
    }

    const entry: LogEntry = {
      timestamp: json.timestamp,
      message: json.msg,
      level: json.level,
      method: json.req?.method,
      url: json.req?.url,
      status: json.res?.status,
      responseTime: json.responseTime,
      correlationId,
      service: json.service,
      error,
    }

    logs.push(entry)
  }

  return logs
}

export function formatLogEntry(entry: LogEntry, indent = ""): string {
  const level = entry.level?.toUpperCase() || "INFO"

  // Format level with color
  let levelFormatted: string
  switch (level) {
    case "ERROR":
      levelFormatted = red(level.padEnd(5))
      break
    case "WARN":
      levelFormatted = yellow(level.padEnd(5))
      break
    case "INFO":
      levelFormatted = cyan(level.padEnd(5))
      break
    case "DEBUG":
      levelFormatted = gray(level.padEnd(5))
      break
    default:
      levelFormatted = level.padEnd(5)
  }

  let formatted = `${indent}[${gray(entry.timestamp)}] ${levelFormatted} ${entry.message}`

  // Build context from all fields except msg and stack
  const contextFields: string[] = []
  const excludedKeys = new Set([
    "msg",
    "message",
    "stack",
    "timestamp",
    "level",
    "correlationId",
    "error",
  ])

  // Process all entry fields
  Object.entries(entry).forEach(([key, value]) => {
    if (
      !excludedKeys.has(key) &&
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      // Format based on the key type
      let formattedValue: string

      switch (key) {
        case "status":
          // Color status codes
          if (typeof value === "number") {
            if (value >= 200 && value < 300) {
              formattedValue = green(value.toString())
            } else if (value >= 400 && value < 500) {
              formattedValue = yellow(value.toString())
            } else if (value >= 500) {
              formattedValue = red(value.toString())
            } else {
              formattedValue = value.toString()
            }
          } else {
            formattedValue = value.toString()
          }
          break

        case "method":
          formattedValue = blue(value.toString())
          break

        case "url":
          formattedValue = blue(value.toString())
          break

        case "responseTime":
          formattedValue = `${value}ms`
          break

        case "service":
          formattedValue = cyan(value.toString())
          break

        default:
          formattedValue = value.toString()
      }

      contextFields.push(`${gray(key)}=${formattedValue}`)
    }
  })

  if (contextFields.length > 0) {
    formatted += ` ${gray("(")}${contextFields.join(gray(", "))}${gray(")")}`
  }

  // Check for error details
  if (entry.error) {
    formatted += "\n" + formatError(entry.error, indent + "   ")
  }

  return formatted
}

export function formatError(error: LogEntryError, indent = ""): string {
  let formatted = `${indent}${red("Error:")} ${error.message}`
  if (error.code) {
    formatted += ` ${gray(`(${error.code})`)}`
  }
  if (error.status) {
    formatted += ` ${gray(`[${error.status}]`)}`
  }
  if (error.stack) {
    formatted += `\n${formatStackTrace(error.stack, indent + "  ")}`
  }
  return formatted
}

export function formatStackTrace(stack: string, indent = ""): string {
  const lines = stack.split("\n")
  const formatted: string[] = []

  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (!trimmed) return

    // First line is usually the error message
    if (index === 0) {
      formatted.push(`${indent}${gray("Stack:")} ${red(trimmed)}`)
      return
    }

    // Format stack frames
    // Match patterns like:
    // "at Function.name (file:line:col)"
    // "at async Function.name (file:line:col)"
    // "at file:line:col"
    // "at async file:line:col"
    // "at process.processTicksAndRejections (node:internal/...)"
    const frameMatch = trimmed.match(
      /^at\s+(?:async\s+)?(?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?$/
    )
    if (frameMatch) {
      const [, functionName, file, line, col] = frameMatch
      const fileName = file.split("/").pop() || file

      // Check if this is a node internal
      const isNodeInternal = file.startsWith("node:")

      if (functionName) {
        if (isNodeInternal) {
          formatted.push(
            `${indent}  ${gray("at")} ${gray(functionName)} ${gray(`(${file}:${line}:${col})`)}`
          )
        } else {
          formatted.push(
            `${indent}  ${gray("at")} ${functionName} ${yellow(`(${fileName}:${line}:${col})`)}`
          )
        }
      } else {
        if (isNodeInternal) {
          formatted.push(
            `${indent}  ${gray("at")} ${gray(`${file}:${line}:${col}`)}`
          )
        } else {
          formatted.push(
            `${indent}  ${gray("at")} ${yellow(`${fileName}:${line}:${col}`)}`
          )
        }
      }
    } else {
      // Fallback for other formats
      formatted.push(`${indent}  ${gray(trimmed)}`)
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
