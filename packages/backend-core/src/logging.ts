import env from "./environment"

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

export function pinoSettings() {
  return {
    prettyPrint: {
      levelFirst: true,
    },
    level: env.LOG_LEVEL || "error",
    autoLogging: {
      ignore: (req: { url: string }) => req.url.includes("/health"),
    },
  }
}
