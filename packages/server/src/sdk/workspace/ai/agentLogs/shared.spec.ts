import { determineTrigger } from "./shared"

describe("agent log trigger detection", () => {
  it("classifies test, preview, and channel sessions", () => {
    expect(determineTrigger("test:run-1:case-1")).toBe("Test")
    expect(determineTrigger("chat-preview:abc")).toBe("Chat Preview")
    expect(determineTrigger("slack:C123")).toBe("Slack")
    expect(determineTrigger("msteams:19:abc")).toBe("Microsoft Teams")
    expect(determineTrigger("1234-plain-session")).toBe("Automation")
  })
})
