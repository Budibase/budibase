import { describe, expect, it } from "vitest"
import { getAutomationStatusInfo } from "./statusUtils"

describe("getAutomationStatusInfo", () => {
  it.each([undefined, null, "", "error", "ERROR"])(
    "renders %s as an error",
    value => {
      expect(getAutomationStatusInfo(value)).toEqual({
        color: "red",
        message: "Error",
      })
    }
  )

  it("renders stopped errors", () => {
    expect(getAutomationStatusInfo("stopped_error")).toEqual({
      color: "red",
      message: "Stopped - Error",
    })
  })

  it("renders stopped automations", () => {
    expect(getAutomationStatusInfo("stopped")).toEqual({
      color: "yellow",
      message: "Stopped",
    })
  })

  it("preserves the existing success fallback", () => {
    expect(getAutomationStatusInfo("success")).toEqual({
      color: "green",
      message: "Success",
    })
  })
})
