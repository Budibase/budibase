import { determineTrigger } from "./shared"

describe("agent log trigger detection", () => {
  it("classifies test sessions separately from automation sessions", () => {
    expect(determineTrigger("test:run-1:case-1")).toBe("Test")
    expect(determineTrigger("1234-plain-session")).toBe("Automation")
  })
})
