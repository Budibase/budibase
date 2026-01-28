import { getErrorMessage } from "../errors"

describe("getErrorMessage", () => {
  it("returns a string error as-is", () => {
    expect(getErrorMessage("boom")).toBe("boom")
  })

  it("returns message for Error instances", () => {
    const error = new Error("failed")
    expect(getErrorMessage(error)).toBe("failed")
  })

  it("returns nested message when error.message is an object", () => {
    const error = {
      message: {
        message: "nested",
      },
    }
    expect(getErrorMessage(error)).toBe("nested")
  })

  it("returns nested code when error.message is an object without message", () => {
    const error = {
      message: {
        code: "E_NESTED",
      },
    }
    expect(getErrorMessage(error)).toBe("E_NESTED")
  })

  it("returns top-level code when present", () => {
    const error = {
      code: "E_TOP",
    }
    expect(getErrorMessage(error)).toBe("E_TOP")
  })

  it("stringifies objects when no message fields are present", () => {
    const error = { detail: "extra" }
    expect(getErrorMessage(error)).toBe(JSON.stringify(error))
  })

  it("falls back to String(error) when JSON.stringify fails", () => {
    const error: Record<string, unknown> = {}
    error.self = error
    expect(getErrorMessage(error)).toBe("[object Object]")
  })
})
