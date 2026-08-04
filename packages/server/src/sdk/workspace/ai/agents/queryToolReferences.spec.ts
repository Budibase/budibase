import type { Agent } from "@budibase/types"
import { updateAgentQueryToolReferences } from "./queryToolReferences"

jest.mock("./crud", () => ({
  fetch: jest.fn(),
  update: jest.fn(),
}))

const makeAgent = (overrides: Partial<Agent> = {}): Agent => ({
  _id: "agent_1",
  _rev: "1-agent",
  name: "Agent",
  aiconfig: "config_1",
  operations: [],
  ...overrides,
})

describe("updateAgentQueryToolReferences", () => {
  const existingBindings = {
    readableBinding: "api.owen_wilson.GET random wow",
    runtimeBinding: "rest_owen_wilson_get_random_wow",
  }
  const updatedBindings = {
    readableBinding: "api.owen_wilson.GET another wow",
    runtimeBinding: "rest_owen_wilson_get_another_wow",
  }

  it("updates readable and runtime bindings across agent operations", () => {
    const agent = makeAgent({
      operations: [
        {
          id: "operation_1",
          name: "Main",
          live: true,
          promptInstructions:
            "Use {{ api.owen_wilson.GET random wow }} then {{api.owen_wilson.GET random wow}}.",
          enabledTools: [
            existingBindings.runtimeBinding,
            updatedBindings.runtimeBinding,
            "other_tool",
          ],
          allowKnowledgeSourceDownload: true,
        },
      ],
    })

    const updated = updateAgentQueryToolReferences({
      agent,
      existingBindings,
      updatedBindings,
    })

    expect(updated?.operations?.[0]).toMatchObject({
      promptInstructions:
        "Use {{ api.owen_wilson.GET another wow }} then {{api.owen_wilson.GET another wow}}.",
      enabledTools: [updatedBindings.runtimeBinding, "other_tool"],
    })
  })

  it("updates readable bindings when the sanitised runtime name is unchanged", () => {
    const agent = makeAgent({
      operations: [
        {
          id: "operation_1",
          name: "Main",
          live: false,
          promptInstructions: "{{ api.owen_wilson.Old name }}",
          enabledTools: ["rest_owen_wilson_same_name"],
          allowKnowledgeSourceDownload: true,
        },
      ],
    })

    const updated = updateAgentQueryToolReferences({
      agent,
      existingBindings: {
        readableBinding: "api.owen_wilson.Old name",
        runtimeBinding: "rest_owen_wilson_same_name",
      },
      updatedBindings: {
        readableBinding: "api.owen_wilson.New name",
        runtimeBinding: "rest_owen_wilson_same_name",
      },
    })

    expect(updated?.operations?.[0]).toMatchObject({
      promptInstructions: "{{ api.owen_wilson.New name }}",
      enabledTools: ["rest_owen_wilson_same_name"],
    })
  })

  it("does not update unrelated agents", () => {
    const agent = makeAgent({
      operations: [
        {
          id: "operation_1",
          name: "Main",
          live: false,
          promptInstructions:
            "Mention api.owen_wilson.GET random wow as plain text.",
          enabledTools: ["other_tool"],
          allowKnowledgeSourceDownload: true,
        },
      ],
    })

    expect(
      updateAgentQueryToolReferences({
        agent,
        existingBindings,
        updatedBindings,
      })
    ).toBeUndefined()
  })
})
