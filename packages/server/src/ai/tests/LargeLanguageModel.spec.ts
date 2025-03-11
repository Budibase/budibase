import { LargeLanguageModel } from "../LargeLanguageModel"
import { quotas } from "@budibase/pro"
import { configs, context, setEnv } from "@budibase/backend-core"
import {
  AIInnerConfig,
  ConfigType,
  MonthlyQuotaName,
  QuotaUsageType,
} from "@budibase/types"
import { OpenAI } from "../models"
import { mocks } from "@budibase/backend-core/tests"
import nock from "nock"
import { mockChatGPTResponse } from "../../tests/utilities/mocks/openai"
import TestConfiguration from "../../tests/utilities/TestConfiguration"

describe("LargeLanguageModel", () => {
  const config = new TestConfiguration()
  let cleanup: () => void

  beforeAll(async () => {
    await config.init()
    cleanup = setEnv({ OPENAI_API_KEY: "test" })
  })

  beforeEach(async () => {
    nock.cleanAll()
    await deleteConfig()
    mocks.licenses.useCloudFree()
  })

  afterAll(async () => {
    config.end()
    cleanup()
  })

  const getAIUsage = async () => {
    const { total } = await config.doInTenant(() =>
      quotas.getCurrentUsageValues(
        QuotaUsageType.MONTHLY,
        MonthlyQuotaName.BUDIBASE_AI_CREDITS
      )
    )
    return total
  }

  async function expectAIUsage(expected: number, f: () => Promise<void>) {
    const before = await getAIUsage()
    await f()
    const after = await getAIUsage()
    const usage = after - before
    expect(usage).toEqual(expected)
  }

  async function deleteConfig() {
    await config.doInTenant(async () => {
      const db = context.getGlobalDB()
      const config = await db.tryGet(configs.generateConfigID(ConfigType.AI))
      if (config) {
        await db.remove(config)
      }
    })
  }

  async function saveConfig(config: AIInnerConfig) {
    await configs.save({ type: ConfigType.AI, config })
  }

  describe("forCurrentTenant factory method", () => {
    it("should not initialise an llm if AI config is not defined", async () => {
      await config.doInTenant(async () => {
        const llmWrapper = await LargeLanguageModel.forCurrentTenant(
          "gpt-4o-mini"
        )
        expect(llmWrapper.llm).toBeUndefined()
      })
    })

    it("should not initialise an llm if no default config is selected", async () => {
      await config.doInTenant(async () => {
        await saveConfig({})
        const llmWrapper = await LargeLanguageModel.forCurrentTenant(
          "gpt-4o-mini"
        )
        expect(llmWrapper.llm).toBeUndefined()
      })
    })

    it("should initialize llm property with the correct provider", async () => {
      await config.doInTenant(async () => {
        await saveConfig({
          myaiconfig: {
            name: "myaiconfig",
            active: true,
            defaultModel: "gpt-4o-mini",
            apiKey: "api-key",
            provider: "OpenAI",
            isDefault: true,
          },
        })

        const llmWrapper = await LargeLanguageModel.forCurrentTenant(
          "gpt-4o-mini"
        )
        expect(llmWrapper.llm).toBeInstanceOf(OpenAI)
      })
    })
  })

  describe("run", () => {
    let lastPrompt: string | null = null
    beforeEach(() => {
      lastPrompt = null
      mockChatGPTResponse((prompt: string) => {
        lastPrompt = prompt
        return "response"
      })
    })

    afterEach(() => {
      mocks.licenses.useCloudFree()
    })

    it("should not use credits if own config supplied", async () => {
      await config.doInTenant(async () => {
        await saveConfig({
          myaiconfig: {
            name: "myaiconfig",
            active: true,
            defaultModel: "gpt-4o-mini",
            apiKey: "api-key",
            provider: "OpenAI",
            isDefault: true,
          },
        })

        const llmWrapper = await LargeLanguageModel.forCurrentTenant(
          "gpt-4o-mini"
        )

        await expectAIUsage(0, async () => {
          await llmWrapper.run("test prompt")
        })

        expect(lastPrompt).toEqual("test prompt")
      })
    })

    it("should use credits if falling back to Budibase AI", async () => {
      await config.doInTenant(async () => {
        mocks.licenses.useBudibaseAI()

        const llmWrapper = await LargeLanguageModel.forCurrentTenant(
          "gpt-4o-mini"
        )

        await expectAIUsage(5, async () => {
          await llmWrapper.run("test prompt")
        })

        expect(lastPrompt).toEqual("test prompt")
      })
    })
  })
})
