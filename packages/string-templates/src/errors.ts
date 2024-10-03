export class JsErrorTimeout extends Error {
  code = "ERR_SCRIPT_EXECUTION_TIMEOUT"
}

export class UserScriptError extends Error {
  code = "USER_SCRIPT_ERROR"

  constructor(readonly userScriptError: Error) {
    super(
      `error while running user-supplied JavaScript: ${userScriptError.toString()}`
    )
  }
}
