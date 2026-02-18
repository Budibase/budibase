import { composeAutomationAgentSystemPrompt } from "./index"

describe("composeAutomationAgentSystemPrompt", () => {
  it("always includes core Budibase safety instructions", () => {
    const prompt = composeAutomationAgentSystemPrompt({
      baseSystemPrompt: "You are a chat support agent.",
      includeGoal: false,
    })

    expect(prompt).toContain("You are a Budibase AI agent.")
    expect(prompt).toContain("You are a chat support agent.")
    expect(prompt.indexOf("You are a Budibase AI agent.")).toBeLessThan(
      prompt.indexOf("You are a chat support agent.")
    )
  })

  it("includes automation-only execution guidance when no base prompt is provided", () => {
    const prompt = composeAutomationAgentSystemPrompt({
      includeGoal: false,
    })

    expect(prompt).toContain(
      "You are a helpful automation agent running inside a Budibase workflow."
    )
    expect(prompt).toContain(
      "This is a non-interactive automation run: do not ask the user follow-up questions or present choices."
    )
    expect(prompt).toContain(
      "When storing data in tables, always use plain text for text fields."
    )
  })

  it("appends goal and prompt instructions when provided", () => {
    const prompt = composeAutomationAgentSystemPrompt({
      includeGoal: true,
      goal: "Close all open P1 incidents",
      promptInstructions: "Use the incident tools first.",
    })

    expect(prompt).toContain("Your goal: Close all open P1 incidents")
    expect(prompt).toContain("Use the incident tools first.")
  })
})
