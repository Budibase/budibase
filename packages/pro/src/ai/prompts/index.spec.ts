import {
  composeAgentSystemPrompt,
  composeAutomationAgentBasePrompt,
} from "./index"

describe("composeAgentSystemPrompt", () => {
  it("always includes core Budibase safety instructions", () => {
    const prompt = composeAgentSystemPrompt({
      baseSystemPrompt: "You are a chat support agent.",
      includeGoal: false,
    })

    expect(prompt).toContain("You are a Budibase AI agent.")
    expect(prompt).toContain("You are a chat support agent.")
    expect(prompt.indexOf("You are a Budibase AI agent.")).toBeLessThan(
      prompt.indexOf("You are a chat support agent.")
    )
  })

  it("does not inject a mode prompt when no base prompt is provided", () => {
    const prompt = composeAgentSystemPrompt({
      includeGoal: false,
    })

    expect(prompt).not.toContain(
      "You are a helpful automation agent running inside a Budibase workflow."
    )
  })

  it("includes automation execution guidance when automation base prompt is provided", () => {
    const prompt = composeAgentSystemPrompt({
      baseSystemPrompt: composeAutomationAgentBasePrompt(),
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
    const prompt = composeAgentSystemPrompt({
      includeGoal: true,
      goal: "Close all open P1 incidents",
      promptInstructions: "Use the incident tools first.",
    })

    expect(prompt).toContain("Your goal: Close all open P1 incidents")
    expect(prompt).toContain("Use the incident tools first.")
  })
})

describe("composeAutomationAgentBasePrompt", () => {
  it("returns automation-specific execution and formatting guidance", () => {
    const prompt = composeAutomationAgentBasePrompt()
    expect(prompt).toContain(
      "You are a helpful automation agent running inside a Budibase workflow."
    )
    expect(prompt).toContain(
      "When storing data in tables, always use plain text for text fields."
    )
  })
})
