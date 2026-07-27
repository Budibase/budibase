import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("test the agent action", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
    await config.api.automation.deleteAll()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  afterAll(() => {
    config.end()
  })

  it("should return an error when no agent is selected", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .agent({ agentId: "", prompt: "Test prompt" })
      .test({ fields: {} })

    expect(result.steps[0].outputs.response).toEqual(
      "Agent step failed: No agent selected"
    )
    expect(result.steps[0].outputs.success).toBeFalsy()
  })

  it("should return an error when no prompt is provided", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .agent({ agentId: "test-agent-id", prompt: "" })
      .test({ fields: {} })

    expect(result.steps[0].outputs.response).toEqual(
      "Agent step failed: No prompt provided"
    )
    expect(result.steps[0].outputs.success).toBeFalsy()
  })
})
