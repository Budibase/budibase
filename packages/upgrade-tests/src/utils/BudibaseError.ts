import { AxiosError } from "axios"
import { DockerLogEntry, parseStructuredLogs } from "./dockerLogs"

export interface BudibaseErrorDetails {
  correlationId: string
  method: string
  url: string
  statusCode: number
  statusText: string
  responseBody: any
  requestHeaders: Record<string, any>
  requestData?: any
  serverLogs?: string[]
  parsedLogs?: DockerLogEntry[]
}

export class BudibaseError extends Error {
  public details: BudibaseErrorDetails

  constructor(message: string, details: BudibaseErrorDetails) {
    super(message)
    this.name = "BudibaseError"
    this.details = details
  }

  static async fromAxiosError(error: AxiosError): Promise<BudibaseError> {
    const config = error.config!
    const response = error.response

    const correlationId = config.headers?.["x-budibase-correlation-id"]
    if (!correlationId) {
      throw new Error("Correlation ID is required for BudibaseError")
    }

    let parsedLogs: DockerLogEntry[] | undefined

    try {
      parsedLogs = await parseStructuredLogs(correlationId)
    } catch (e) {
      // Ignore errors fetching logs
      console.warn("Failed to fetch Docker logs:", e)
    }

    const details: BudibaseErrorDetails = {
      correlationId,
      method: config.method?.toUpperCase() || "UNKNOWN",
      url: config.url || "unknown",
      statusCode: response?.status || 0,
      statusText: response?.statusText || "Unknown Error",
      responseBody: response?.data || null,
      requestHeaders: config.headers || {},
      requestData: config.data,
      parsedLogs,
    }

    const message = BudibaseError.formatErrorMessage(details)
    return new BudibaseError(message, details)
  }

  private static formatErrorMessage(details: BudibaseErrorDetails): string {
    const lines: string[] = [
      `Budibase API Error: ${details.statusCode} ${details.statusText}`,
      ``,
      `Request Details:`,
      `  Method: ${details.method}`,
      `  URL: ${details.url}`,
      `  Correlation ID: ${details.correlationId}`,
    ]

    if (details.requestData) {
      lines.push(
        `  Request Data: ${JSON.stringify(details.requestData, null, 2).split("\n").join("\n  ")}`
      )
    }

    lines.push(``, `Response:`)

    if (details.responseBody) {
      // Check for common error response formats
      if (typeof details.responseBody === "object") {
        const body = details.responseBody

        // Common error fields
        if (body.error || body.message || body.errors) {
          if (body.error) {
            lines.push(`  Error: ${body.error}`)
          }
          if (body.message && body.message !== body.error) {
            lines.push(`  Message: ${body.message}`)
          }
          if (body.errors && Array.isArray(body.errors)) {
            lines.push(`  Errors:`)
            body.errors.forEach((err: any, idx: number) => {
              lines.push(
                `    ${idx + 1}. ${typeof err === "string" ? err : err.message || JSON.stringify(err)}`
              )
            })
          }

          // Include stack trace if present
          if (body.stack) {
            lines.push(``, `  Stack Trace:`)
            body.stack.split("\n").forEach((line: string) => {
              lines.push(`    ${line}`)
            })
          }

          // Include any other fields
          const knownFields = [
            "error",
            "message",
            "errors",
            "stack",
            "statusCode",
            "status",
          ]
          const otherFields = Object.keys(body).filter(
            k => !knownFields.includes(k)
          )
          if (otherFields.length > 0) {
            lines.push(``, `  Additional Details:`)
            otherFields.forEach(field => {
              const value =
                typeof body[field] === "object"
                  ? JSON.stringify(body[field], null, 2)
                      .split("\n")
                      .join("\n    ")
                  : body[field]
              lines.push(`    ${field}: ${value}`)
            })
          }
        } else {
          // Fallback to JSON
          const bodyStr = JSON.stringify(details.responseBody, null, 2)
          lines.push(...bodyStr.split("\n").map(line => `  ${line}`))
        }
      } else {
        // String response
        lines.push(
          ...String(details.responseBody)
            .split("\n")
            .map(line => `  ${line}`)
        )
      }
    } else {
      lines.push(`  <no response body>`)
    }

    if (details.parsedLogs && details.parsedLogs.length > 0) {
      lines.push(``, `Server Logs (Correlation ID: ${details.correlationId}):`)

      // Import the formatter
      const { formatLogEntry } = require("./dockerLogs")

      details.parsedLogs.forEach(log => {
        lines.push(formatLogEntry(log, "  "))
      })
    } else if (details.serverLogs && details.serverLogs.length > 0) {
      lines.push(``, `Server Logs (Correlation ID: ${details.correlationId}):`)
      details.serverLogs.forEach(log => {
        lines.push(`  ${log}`)
      })
    }

    return lines.join("\n")
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      details: this.details,
    }
  }
}
