export class JsTimeoutError extends Error {
  static message = "Timed out while executing JS"
  static code = "JS_TIMEOUT_ERROR"
  code: string = JsTimeoutError.code

  constructor() {
    super(JsTimeoutError.message)
  }
}

export class UserScriptError extends Error {
  static code = "USER_SCRIPT_ERROR"
  code: string = UserScriptError.code

  constructor(readonly userScriptError: Error) {
    super(
      `error while running user-supplied JavaScript: ${userScriptError.toString()}`
    )
  }
}
