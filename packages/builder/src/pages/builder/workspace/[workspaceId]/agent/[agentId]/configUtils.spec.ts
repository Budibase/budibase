import { shouldAutoSelectAgentModel } from "./configUtils"

describe("shouldAutoSelectAgentModel", () => {
  const modelOptions = [
    { label: "GPT-4o", value: "config-1" },
    { label: "Claude", value: "config-2" },
  ]

  it("returns true when agent and draft model are empty", () => {
    expect(
      shouldAutoSelectAgentModel({
        modelOptions,
        agentAiconfig: "",
        draftAiconfig: "",
      })
    ).toBe(true)
  })

  it("returns false when agent already has a model", () => {
    expect(
      shouldAutoSelectAgentModel({
        modelOptions,
        agentAiconfig: "existing-config",
        draftAiconfig: "",
      })
    ).toBe(false)
  })

  it("returns false when draft already has a model", () => {
    expect(
      shouldAutoSelectAgentModel({
        modelOptions,
        agentAiconfig: "",
        draftAiconfig: "draft-config",
      })
    ).toBe(false)
  })

  it("returns false when no model options exist", () => {
    expect(
      shouldAutoSelectAgentModel({
        modelOptions: [],
        agentAiconfig: "",
        draftAiconfig: "",
      })
    ).toBe(false)
  })
})
