import { exec } from "child_process"
import { promisify } from "util"
import { red, yellow, cyan, gray, blue, green } from "chalk"

const execAsync = promisify(exec)

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
  stack?: string
}

function extractJSON(line: string): Record<string, any> | null {
  const match = line.match(/(\{.+\})/)
  return match ? JSON.parse(match[1]) : null
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

    if (json?.req?.correlationId !== requestId) {
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
    const entry: LogEntry = {
      timestamp: json.timestamp,
      message: json.msg,
      level: json.level,
      method: json.req?.method,
      url: json.req?.url,
      status: json.res?.status,
      responseTime: json.responseTime,
      correlationId: json.req?.correlationId,
      service: json.service,
      stack: json.stack,
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

  // Check for stack trace
  if (entry.stack) {
    formatted += "\n" + formatStackTrace(entry.stack, indent + "         ")
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
    // Match patterns like "at Function.name (file:line:col)" or "at file:line:col"
    const frameMatch = trimmed.match(
      /^at\s+(?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?$/
    )
    if (frameMatch) {
      const [, functionName, file, line, col] = frameMatch
      const fileName = file.split("/").pop() || file

      if (functionName) {
        formatted.push(
          `${indent}  ${gray("at")} ${functionName} ${yellow(`(${fileName}:${line}:${col})`)}`
        )
      } else {
        formatted.push(
          `${indent}  ${gray("at")} ${yellow(`${fileName}:${line}:${col}`)}`
        )
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
