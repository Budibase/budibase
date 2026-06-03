import { setEnv as setCoreEnv } from "@budibase/backend-core"
import { Model } from "@budibase/types"
import { setupDefaultCompletionsAIConfig } from "../../../tests/utilities/aiConfig"
import { mockChatGPTResponse } from "../../../tests/utilities/mocks/ai/openai"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"
import * as automation from "../../index"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("Grant application review automations", () => {
  const config = new TestConfiguration()
  let resetEnv: (() => void) | undefined
  let cleanupDefaultAIConfig: (() => Promise<void>) | undefined

  beforeAll(async () => {
    await config.init()
    await automation.init()
  })

  beforeEach(async () => {
    await config.api.automation.deleteAll()
    resetEnv = setCoreEnv({ SELF_HOSTED: false })
    cleanupDefaultAIConfig = await setupDefaultCompletionsAIConfig(config)
    await config.publish()
  })

  afterEach(async () => {
    await cleanupDefaultAIConfig?.()
    resetEnv?.()
  })

  afterAll(async () => {
    await automation.shutdown()
    config.end()
  })

  it("uses AI review notes to create a scored application row", async () => {
    const table = await config.api.table.save(basicTable())

    mockChatGPTResponse("Eligible: strong community impact.")
    mockChatGPTResponse("Score 92 - recommend approval.")

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .promptLLM({
        prompt:
          "Assess eligibility for {{ trigger.fields.organisation }}: {{ trigger.fields.summary }}",
        model: Model.GPT_4O_MINI,
      })
      .openai({
        prompt:
          "Score this grant review for {{ trigger.fields.organisation }}: {{ steps.1.response }}",
        model: Model.GPT_4O_MINI,
      })
      .createRow({
        row: {
          tableId: table._id,
          name: "{{ trigger.fields.organisation }}",
          description: "{{ steps.2.response }}",
        },
      })
      .serverLog({
        text: "{{ steps.3.row.name }} review: {{ steps.3.row.description }}",
      })
      .test({
        fields: {
          organisation: "Community Kitchens",
          summary: "Expanding free weekly meals for families.",
        },
      })

    expect(results.steps[0].outputs.response).toBe(
      "Eligible: strong community impact."
    )
    expect(results.steps[1].outputs.response).toBe(
      "Score 92 - recommend approval."
    )
    expect(results.steps[2].outputs.row).toMatchObject({
      name: "Community Kitchens",
      description: "Score 92 - recommend approval.",
    })
    expect(results.steps[3].outputs.message).toContain(
      "Community Kitchens review"
    )
  })
})
