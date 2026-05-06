import { setEnv as setCoreEnv } from "@budibase/backend-core"
import { ContentType, Model } from "@budibase/types"
import nock from "nock"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { setupDefaultCompletionsAIConfig } from "../../../../tests/utilities/aiConfig"
import { mockChatGPTResponse } from "../../../../tests/utilities/mocks/ai/openai"
import * as automation from "../../../index"
import { createAutomationBuilder } from "../../utilities/AutomationTestBuilder"

describe("AI action automations", () => {
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
    nock.cleanAll()
  })

  afterAll(async () => {
    await automation.shutdown()
    config.end()
  })

  it("runs prompt, summarise and translate steps through the configured LLM", async () => {
    mockChatGPTResponse("Prompt response")
    mockChatGPTResponse("Short summary")
    mockChatGPTResponse("Bonjour")

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .promptLLM({
        prompt: "Say hello",
        model: Model.GPT_4O_MINI,
      })
      .summarise({
        text: "A long passage that should be summarised.",
      })
      .translate({
        text: "Hello",
        language: "French",
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toEqual({
      success: true,
      response: "Prompt response",
    })
    expect(results.steps[1].outputs).toEqual({
      success: true,
      response: "Short summary",
    })
    expect(results.steps[2].outputs).toEqual({
      success: true,
      response: "Bonjour",
    })
  })

  it("runs generate text and classify steps through the configured LLM", async () => {
    mockChatGPTResponse("Generated content")
    mockChatGPTResponse("Support")

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .generateText({
        contentType: ContentType.EMAIL,
        instructions: "Write a concise update",
      })
      .classify({
        inputType: "text",
        textInput: "I need help",
        categoryItems: [{ category: "Sales" }, { category: "Support" }],
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toEqual({
      success: true,
      response: "Generated content",
    })
    expect(results.steps[1].outputs).toEqual({
      success: true,
      category: "Support",
      response: "Support",
    })
  })

  it("reports validation errors before calling the LLM", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .promptLLM({
        prompt: null as unknown as string,
        model: Model.GPT_4O_MINI,
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toEqual({
      success: false,
      response: "No prompt supplied",
    })
  })

  it("reports generate text empty LLM responses", async () => {
    mockChatGPTResponse("   ")

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .generateText({
        contentType: ContentType.OTHER,
        instructions: "Write something useful",
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toEqual({
      success: false,
      response:
        "Generate Text AI Step Failed: AI did not return any content.",
    })
  })

  it("reports classify categories outside the configured list", async () => {
    mockChatGPTResponse("Billing")

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .classify({
        inputType: "text",
        textInput: "I need help",
        categoryItems: [{ category: "Sales" }, { category: "Support" }],
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs.success).toBe(false)
    expect(results.steps[0].outputs.response).toContain(
      "AI returned category 'Billing'"
    )
  })

  it("runs the legacy OpenAI step through the configured LLM", async () => {
    mockChatGPTResponse("Legacy response")

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .openai({
        prompt: "Hello, world",
        model: Model.GPT_4O_MINI,
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs).toEqual({
      success: true,
      response: "Legacy response",
    })
  })
})
