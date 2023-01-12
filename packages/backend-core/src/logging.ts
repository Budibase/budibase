import { Header } from "./constants"
import env from "./environment"
const correlator = require("correlation-id")
import { Options } from "pino-http"
import { IncomingMessage } from "http"

const NonErrors = ["AccountError"]

function isSuppressed(e?: any) {
  return e && e["suppressAlert"]
}

export function logAlert(message: string, e?: any) {
  if (e && NonErrors.includes(e.name) && isSuppressed(e)) {
    return
  }
  let errorJson = ""
  if (e) {
    errorJson = ": " + JSON.stringify(e, Object.getOwnPropertyNames(e))
  }
  console.error(`bb-alert: ${message} ${errorJson}`)
}

export function logAlertWithInfo(
  message: string,
  db: string,
  id: string,
  error: any
) {
  message = `${message} - db: ${db} - doc: ${id} - error: `
  logAlert(message, error)
}

export function logWarn(message: string) {
  console.warn(`bb-warn: ${message}`)
}

export function pinoSettings(): Options {
  return {
    prettyPrint: {
      levelFirst: true,
    },
    genReqId: correlator.getId,
    level: env.LOG_LEVEL || "error",
    autoLogging: {
      ignore: (req: IncomingMessage) => !!req.url?.includes("/health"),
    },
  }
}

const setCorrelationHeader = (headers: any) => {
  const correlationId = correlator.getId()
  if (correlationId) {
    headers[Header.CORRELATION_ID] = correlationId
  }
}

export const correlation = {
  setHeader: setCorrelationHeader,
}
