const NonErrors = ["AccountError"]

function isSuppressed(e?: any) {
  return e && e["suppressAlert"]
}

export function logAlert(message: string, e?: any) {
  if (e && NonErrors.includes(e.name) && isSuppressed(e)) {
    return
  }
  console.error(`bb-alert: ${message}`, e)
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

export function logWarn(message: string, e?: any) {
  console.warn(`bb-warn: ${message}`, e)
}
