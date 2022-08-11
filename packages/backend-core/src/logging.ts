import { Headers } from "./constants"
const correlator = require("correlation-id")

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

const setCorrelationHeader = (headers: any) => {
  const correlationId = correlator.getId()
  if (correlationId) {
    headers[Headers.CORRELATION_ID] = correlationId
  }
}

const correlation = {
  setHeader: setCorrelationHeader,
}

export default {
  logAlert,
  logAlertWithInfo,
  logWarn,
  correlation,
}
