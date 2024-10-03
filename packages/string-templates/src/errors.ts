export class JsErrorTimeout extends Error {
  static code = "ERR_SCRIPT_EXECUTION_TIMEOUT"
}

export class UserScriptError extends Error {
  static code = "USER_SCRIPT_ERROR"

  constructor(readonly userScriptError: Error) {
    super(
      `error while running user-supplied JavaScript: ${userScriptError.toString()}`
    )
  }
}
