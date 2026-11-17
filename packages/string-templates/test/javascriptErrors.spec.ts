import {
  encodeJSBinding,
  JsTimeoutError,
  processStringSync,
  setJSRunner,
  UserScriptError,
} from "../src"

const errors = [
  {
    error: Object.assign(new Error("Script execution timed out"), {
      code: "ERR_SCRIPT_EXECUTION_TIMEOUT",
    }),
    result: "Timed out while executing JS",
  },
  {
    error: Object.assign(new Error("Request execution timed out"), {
      code: "JS_REQUEST_TIMEOUT_ERROR",
    }),
    result: "Request execution timed out",
  },
  { error: new JsTimeoutError(), result: JsTimeoutError.message },
  {
    error: new UserScriptError(new Error("Script failed")),
    result: "Error: Script failed",
  },
  {
    error: new SyntaxError("Invalid script"),
    result: "SyntaxError: Invalid script",
  },
  { error: new Error("Internal failure"), result: "Error while executing JS" },
]

describe("JavaScript evaluation errors", () => {
  it.each(errors)("propagates $error when noThrow is false", ({ error }) => {
    setJSRunner(() => {
      throw error
    })

    expect(() =>
      processStringSync(encodeJSBinding("return 1"), {}, { noThrow: false })
    ).toThrow(error)
  })

  it.each(errors)("renders $error by default", ({ error, result }) => {
    setJSRunner(() => {
      throw error
    })

    expect(processStringSync(encodeJSBinding("return 1"), {})).toBe(result)
  })
})
