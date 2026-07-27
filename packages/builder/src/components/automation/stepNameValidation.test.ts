import { describe, expect, it } from "vitest"

import { isValidAutomationStepName } from "./stepNameValidation"

describe("isValidAutomationStepName", () => {
  it.each([
    "Create row",
    "Create_row",
    "Create-row",
    "Create.row",
    "Create row_1-step.2",
    "123",
  ])("allows valid step name %s", name => {
    expect(isValidAutomationStepName(name)).toBe(true)
  })

  it.each(["Create/row", "Create:row", "Create(row)", "Create@row", ""])(
    "rejects invalid step name %s",
    name => {
      expect(isValidAutomationStepName(name)).toBe(false)
    }
  )
})
