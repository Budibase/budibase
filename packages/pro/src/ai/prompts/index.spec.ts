import type { ContextUser } from "@budibase/types"
import { agentSystemPrompt } from "."

describe("agentSystemPrompt", () => {
  const user = {} as ContextUser

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-08-04T13:30:00.000Z"))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("expresses the current date in the user's timezone", () => {
    const prompt = agentSystemPrompt(user, "Europe/London")

    expect(prompt).toContain("The current date is: 2026-08-04T14:30:00+01:00")
    expect(prompt).toContain("The user's timezone is Europe/London")
    expect(prompt).toContain("Tool values may be in UTC")
  })

  it("falls back to UTC when the timezone is invalid", () => {
    const prompt = agentSystemPrompt(user, "invalid timezone")

    expect(prompt).toContain("The current date is: 2026-08-04T13:30:00.000Z")
    expect(prompt).not.toContain("invalid timezone")
  })

  it("falls back to UTC when no timezone is provided", () => {
    const prompt = agentSystemPrompt(user)

    expect(prompt).toContain("The current date is: 2026-08-04T13:30:00.000Z")
  })
})
