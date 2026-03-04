import { getLockedAgentIdFromPathname } from "./chatboxUtils"

describe("getLockedAgentIdFromPathname", () => {
  it("extracts agent id from a chat route", () => {
    expect(
      getLockedAgentIdFromPathname("/app-chat/my-app/agent/agent-123")
    ).toBe("agent-123")
  })

  it("decodes agent id from a chat route", () => {
    expect(
      getLockedAgentIdFromPathname("/app-chat/my-app/agent/agent%20123")
    ).toBe("agent 123")
  })

  it("supports nested chat paths", () => {
    expect(
      getLockedAgentIdFromPathname("/app-chat/my-app/history/agent/agent-123")
    ).toBe("agent-123")
  })

  it("returns undefined when no agent is provided", () => {
    expect(getLockedAgentIdFromPathname("/app-chat/my-app")).toBeUndefined()
  })

  it("returns undefined for non-chat routes", () => {
    expect(getLockedAgentIdFromPathname("/app/my-app/agent/agent-123")).toBe(
      undefined
    )
  })

  it("returns undefined for invalid encoded agent ids", () => {
    expect(getLockedAgentIdFromPathname("/app-chat/my-app/agent/%ZZ")).toBe(
      undefined
    )
  })
})
