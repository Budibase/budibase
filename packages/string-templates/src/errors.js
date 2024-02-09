class JsErrorTimeout extends Error {
  code = "ERR_SCRIPT_EXECUTION_TIMEOUT"

  constructor() {
    super()
  }
}

module.exports = {
  JsErrorTimeout,
}
