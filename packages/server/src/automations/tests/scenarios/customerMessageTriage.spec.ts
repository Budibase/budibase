import { setEnv as setCoreEnv } from "@budibase/backend-core"
import { ContentType } from "@budibase/types"
import { setupDefaultCompletionsAIConfig } from "../../../tests/utilities/aiConfig"
import { mockChatGPTResponse } from "../../../tests/utilities/mocks/ai/openai"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import * as automation from "../../index"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("Customer message triage automations", () => {
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

  it("summarises, categorises and drafts a localised support reply", async () => {
    mockChatGPTResponse("Customer cannot access their account.")
    mockChatGPTResponse("Support")
    mockChatGPTResponse("We can help you regain access to your account.")
    mockChatGPTResponse(
      "Nous pouvons vous aider a recuperer l'acces a votre compte."
    )

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .summarise({
        text: "{{ trigger.fields.message }}",
      })
      .classify({
        inputType: "text",
        textInput: "{{ steps.1.response }}",
        categoryItems: [{ category: "Sales" }, { category: "Support" }],
      })
      .generateText({
        contentType: ContentType.EMAIL,
        instructions:
          "Draft a concise reply for a {{ steps.2.category }} request: {{ steps.1.response }}",
      })
      .translate({
        text: "{{ steps.3.response }}",
        language: "French",
      })
      .serverLog({
        text: "{{ steps.2.category }} reply: {{ steps.4.response }}",
      })
      .test({
        fields: {
          message:
            "I am locked out of my account and password reset emails are not arriving.",
        },
      })

    expect(results.steps[0].outputs.response).toBe(
      "Customer cannot access their account."
    )
    expect(results.steps[1].outputs).toMatchObject({
      success: true,
      category: "Support",
    })
    expect(results.steps[2].outputs.response).toContain("regain access")
    expect(results.steps[3].outputs.response).toContain("recuperer")
    expect(results.steps[4].outputs.message).toContain("Support reply")
  })
})
