const NonErrors = ["AccountError"]

function isSuppressed(e) {
  return e && e["suppressAlert"]
}

module.exports.logAlert = (message, e) => {
  if (e && NonErrors.includes(e.name) && isSuppressed(e)) {
    return
  }
  let errorJson = ""
  if (e) {
    errorJson = ": " + JSON.stringify(e, Object.getOwnPropertyNames(e))
  }
  console.error(`bb-alert: ${message} ${errorJson}`)
}
