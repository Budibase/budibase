import { determineTrigger } from "./shared"

describe("agent log trigger detection", () => {
  it("classifies eval sessions separately from automation sessions", () => {
    expect(determineTrigger("eval:run-1:case-1")).toBe("Eval")
    expect(determineTrigger("1234-plain-session")).toBe("Automation")
  })
})
