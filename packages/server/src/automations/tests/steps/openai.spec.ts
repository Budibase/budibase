import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { setEnv as setCoreEnv, withEnv } from "@budibase/backend-core"
import { Model, MonthlyQuotaName, QuotaUsageType } from "@budibase/types"
import TestConfiguration from "../../..//tests/utilities/TestConfiguration"
import { mockChatGPTResponse } from "../../../tests/utilities/mocks/ai/openai"
import nock from "nock"
import { quotas } from "@budibase/pro"

describe("test the openai action", () => {
  const config = new TestConfiguration()
  let resetEnv: () => void | undefined

  beforeAll(async () => {
    await config.init()
    await config.api.automation.deleteAll()
  })

  beforeEach(() => {
    resetEnv = setCoreEnv({ SELF_HOSTED: true, OPENAI_API_KEY: "abc123" })
  })

  afterEach(() => {
    resetEnv()
    jest.clearAllMocks()
    nock.cleanAll()
  })

  afterAll(() => {
    config.end()
  })

  const getAIUsage = async () => {
    const { total } = await config.doInContext(config.getProdAppId(), () =>
      quotas.getCurrentUsageValues(
        QuotaUsageType.MONTHLY,
        MonthlyQuotaName.BUDIBASE_AI_CREDITS
      )
    )
    return total
  }

  const expectAIUsage = async <T>(expected: number, f: () => Promise<T>) => {
    const before = await getAIUsage()
    const result = await f()
    const after = await getAIUsage()
    expect(after - before).toEqual(expected)
    return result
  }

  it("should be able to receive a response from ChatGPT given a prompt", async () => {
    mockChatGPTResponse("This is a test")

    // The AI usage is 0 because the AI feature is disabled by default, which
    // means it goes through the "legacy" path which requires you to set your
    // own API key. We don't count this against your quota.
    const result = await expectAIUsage(0, () =>
      createAutomationBuilder(config)
        .onAppAction()
        .openai({ prompt: "Hello, world", model: Model.GPT_4O_MINI })
        .test({ fields: {} })
    )

    expect(result.steps[0].outputs.response).toEqual("This is a test")
    expect(result.steps[0].outputs.success).toBeTruthy()
  })

  it("should present the correct error message when a prompt is not provided", async () => {
    const result = await expectAIUsage(0, () =>
      createAutomationBuilder(config)
        .onAppAction()
        .openai({ prompt: "", model: Model.GPT_4O_MINI })
        .test({ fields: {} })
    )

    expect(result.steps[0].outputs.response).toEqual(
      "Budibase OpenAI Automation Failed: No prompt supplied"
    )
    expect(result.steps[0].outputs.success).toBeFalsy()
  })

  it("should present the correct error message when an error is thrown from the createChatCompletion call", async () => {
    mockChatGPTResponse(() => {
      throw new Error("oh no")
    })

    const result = await expectAIUsage(0, () =>
      createAutomationBuilder(config)
        .onAppAction()
        .openai({ prompt: "Hello, world", model: Model.GPT_4O_MINI })
        .test({ fields: {} })
    )

    expect(result.steps[0].outputs.response).toEqual("Error: No response found")
    expect(result.steps[0].outputs.success).toBeFalsy()
  })

  it("should ensure that the pro AI module is called when the budibase AI features are enabled", async () => {
    mockChatGPTResponse("This is a test")

    // We expect a non-0 AI usage here because it goes through the @budibase/pro
    // path, because we've enabled Budibase AI. The exact value depends on a
    // calculation we use to approximate cost. This uses Budibase's OpenAI API
    // key, so we charge users for it.
    const result = await withEnv({ SELF_HOSTED: false }, async () =>
      expectAIUsage(14, () =>
        createAutomationBuilder(config)
          .onAppAction()
          .openai({ model: Model.GPT_4O_MINI, prompt: "Hello, world" })
          .test({ fields: {} })
      )
    )

    expect(result.steps[0].outputs.response).toEqual("This is a test")
  })
})
