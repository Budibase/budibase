import { getLogsForRequest, LogEntry, formatLogEntry } from "./dockerLogs"

export interface BudibaseErrorDetails {
  correlationId: string
  method: string
  url: string
  statusCode: number
  statusText: string
  responseBody: any
  requestHeaders: Record<string, any>
  requestData?: any
  logs?: LogEntry[]
}

export class BudibaseError extends Error {
  public details: BudibaseErrorDetails

  constructor(message: string, details: BudibaseErrorDetails) {
    super(message)
    this.name = "BudibaseError"
    this.details = details
  }

  static async fromFetchResponse(
    response: Response,
    responseBody: any,
    requestInfo: { method: string; url: string; correlationId: string },
    customMessage?: string
  ): Promise<BudibaseError> {
    const { method, url, correlationId } = requestInfo

    const logs = await getLogsForRequest(correlationId)

    const details: BudibaseErrorDetails = {
      correlationId,
      method: method.toUpperCase(),
      url,
      statusCode: response.status,
      statusText: response.statusText || "Unknown Error",
      responseBody,
      requestHeaders: {}, // Note: fetch doesn't expose request headers easily
      logs: logs,
    }

    const message = customMessage || BudibaseError.formatErrorMessage(details)
    return new BudibaseError(message, details)
  }

  private static formatErrorMessage(details: BudibaseErrorDetails): string {
    const lines: string[] = [
      `API Error:`,
      `  Method: ${details.method}`,
      `  URL: ${details.url}`,
      `  Status: ${details.statusCode} ${details.statusText}`,
      `  Correlation ID: ${details.correlationId}`,
    ]

    if (details.requestData) {
      lines.push(``, `Request:`)
      lines.push(JSON.stringify(details.requestData, null, 2))
    }

    lines.push(``, `Response:`)

    if (details.responseBody) {
      lines.push(JSON.stringify(details.responseBody, null, 2))
    } else {
      lines.push("  No response body")
    }

    if (details.logs) {
      lines.push(``, `Server Logs`)
      for (const log of details.logs) {
        lines.push(formatLogEntry(log, "  "))
      }
    }

    return lines.join("\n")
  }
}
