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

export function logWarn(message: string) {
  console.warn(`bb-warn: ${message}`)
}

export default {
  logAlert,
  logWarn,
}
