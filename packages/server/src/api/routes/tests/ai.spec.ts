import { z } from "zod"
import { mockChatGPTResponse } from "../../../tests/utilities/mocks/ai/openai"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import nock from "nock"
import { configs, env, features, setEnv } from "@budibase/backend-core"
import {
  AIInnerConfig,
  ConfigType,
  Feature,
  License,
  PlanModel,
  PlanType,
  ProviderConfig,
  StructuredOutput,
} from "@budibase/types"
import { context } from "@budibase/backend-core"
import { generator, mocks } from "@budibase/backend-core/tests"
import { ai, quotas } from "@budibase/pro"

function dedent(str: string) {
  return str
    .split("\n")
    .map(line => line.trim())
    .join("\n")
}

type SetupFn = (
  config: TestConfiguration
) => Promise<() => Promise<void> | void>
interface TestSetup {
  name: string
  setup: SetupFn
}

function budibaseAI(): SetupFn {
  return async () => {
    const cleanup = setEnv({
      OPENAI_API_KEY: "test-key",
    })
    mocks.licenses.useBudibaseAI()
    return async () => {
      mocks.licenses.useCloudFree()
      cleanup()
    }
  }
}

function customAIConfig(providerConfig: Partial<ProviderConfig>): SetupFn {
  return async (config: TestConfiguration) => {
    mocks.licenses.useAICustomConfigs()

    const innerConfig: AIInnerConfig = {
      myaiconfig: {
        provider: "OpenAI",
        name: "OpenAI",
        apiKey: "test-key",
        defaultModel: "gpt-4o-mini",
        active: true,
        isDefault: true,
        ...providerConfig,
      },
    }

    const { id, rev } = await config.doInTenant(
      async () =>
        await configs.save({
          type: ConfigType.AI,
          config: innerConfig,
        })
    )

    return async () => {
      mocks.licenses.useCloudFree()

      await config.doInTenant(async () => {
        const db = context.getGlobalDB()
        await db.remove(id, rev)
      })
    }
  }
}

const allProviders: TestSetup[] = [
  {
    name: "OpenAI API key",
    setup: async () => {
      return setEnv({
        OPENAI_API_KEY: "test-key",
      })
    },
  },
  {
    name: "OpenAI API key with custom config",
    setup: customAIConfig({ provider: "OpenAI", defaultModel: "gpt-4o-mini" }),
  },
  {
    name: "BudibaseAI",
    setup: budibaseAI(),
  },
]

describe("AI", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  describe.each(allProviders)("provider: $name", ({ setup }: TestSetup) => {
    let cleanup: () => Promise<void> | void
    beforeAll(async () => {
      cleanup = await setup(config)
    })

    afterAll(async () => {
      const maybePromise = cleanup()
      if (maybePromise) {
        await maybePromise
      }
    })

    describe("POST /api/ai/js", () => {
      let cleanup: () => void
      beforeAll(() => {
        cleanup = features.testutils.setFeatureFlags("*", {
          AI_JS_GENERATION: true,
        })
      })

      afterAll(() => {
        cleanup()
      })

      it("handles correct plain code response", async () => {
        mockChatGPTResponse(`return 42`)

        const { code } = await config.api.ai.generateJs({ prompt: "test" })
        expect(code).toBe("return 42")
      })

      it("handles correct markdown code response", async () => {
        mockChatGPTResponse(
          dedent(`
                \`\`\`js
                return 42
                \`\`\`
            `)
        )

        const { code } = await config.api.ai.generateJs({ prompt: "test" })
        expect(code).toBe("return 42")
      })

      it("handles multiple markdown code blocks returned", async () => {
        mockChatGPTResponse(
          dedent(`
                This:

                \`\`\`js
                return 42
                \`\`\`

                Or this:

                \`\`\`js
                return 10
                \`\`\`
            `)
        )

        const { code } = await config.api.ai.generateJs({ prompt: "test" })
        expect(code).toBe("return 42")
      })

      // TODO: handle when this happens
      it.skip("handles no code response", async () => {
        mockChatGPTResponse("I'm sorry, you're quite right, etc.")
        const { code } = await config.api.ai.generateJs({ prompt: "test" })
        expect(code).toBe("")
      })

      it("handles LLM errors", async () => {
        mockChatGPTResponse(() => {
          throw new Error("LLM error")
        })
        await config.api.ai.generateJs({ prompt: "test" }, { status: 500 })
      })
    })

    describe("POST /api/ai/cron", () => {
      it("handles correct cron response", async () => {
        mockChatGPTResponse("0 0 * * *")

        const { message } = await config.api.ai.generateCron({
          prompt: "test",
        })
        expect(message).toBe("0 0 * * *")
      })

      it("handles expected LLM error", async () => {
        mockChatGPTResponse("Error generating cron: skill issue")

        await config.api.ai.generateCron(
          {
            prompt: "test",
          },
          { status: 400 }
        )
      })

      it("handles unexpected LLM error", async () => {
        mockChatGPTResponse(() => {
          throw new Error("LLM error")
        })

        await config.api.ai.generateCron(
          {
            prompt: "test",
          },
          { status: 500 }
        )
      })
    })
  })
})

describe("BudibaseAI", () => {
  const config = new TestConfiguration()
  let cleanup: () => void | Promise<void>
  beforeAll(async () => {
    await config.init()
    cleanup = await budibaseAI()(config)
  })

  afterAll(async () => {
    if ("then" in cleanup) {
      await cleanup()
    } else {
      cleanup()
    }
    config.end()
  })

  describe("POST /api/ai/chat", () => {
    let licenseKey = "test-key"
    let internalApiKey = "api-key"

    let envCleanup: () => void
    let featureCleanup: () => void
    beforeAll(() => {
      envCleanup = setEnv({
        SELF_HOSTED: false,
        INTERNAL_API_KEY: internalApiKey,
      })
      featureCleanup = features.testutils.setFeatureFlags("*", {
        AI_JS_GENERATION: true,
      })
    })

    afterAll(() => {
      featureCleanup()
      envCleanup()
    })

    beforeEach(async () => {
      await config.newTenant()
      nock.cleanAll()
      const license: License = {
        plan: {
          type: PlanType.FREE,
          model: PlanModel.PER_USER,
          usesInvoicing: false,
        },
        features: [Feature.BUDIBASE_AI],
        quotas: {} as any,
        tenantId: config.tenantId,
      }
      nock(env.ACCOUNT_PORTAL_URL)
        .get(`/api/license/${licenseKey}`)
        .reply(200, license)
    })

    async function getQuotaUsage() {
      return await context.doInSelfHostTenantUsingCloud(
        config.getTenantId(),
        async () => {
          return await quotas.getQuotaUsage()
        }
      )
    }

    it("handles correct chat response", async () => {
      let usage = await getQuotaUsage()
      expect(usage._id).toBe(`quota_usage_${config.getTenantId()}`)
      expect(usage.monthly.current.budibaseAICredits).toBe(0)

      mockChatGPTResponse("Hi there!")
      const { message } = await config.api.ai.chat({
        messages: [{ role: "user", content: "Hello!" }],
        licenseKey: licenseKey,
      })
      expect(message).toBe("Hi there!")

      usage = await getQuotaUsage()
      expect(usage.monthly.current.budibaseAICredits).toBeGreaterThan(0)
    })

    it("handles chat response error", async () => {
      mockChatGPTResponse(() => {
        throw new Error("LLM error")
      })
      await config.api.ai.chat(
        {
          messages: [{ role: "user", content: "Hello!" }],
          licenseKey: "test-key",
        },
        { status: 500 }
      )
    })

    it("handles no license", async () => {
      nock.cleanAll()
      nock(env.ACCOUNT_PORTAL_URL).get(`/api/license/${licenseKey}`).reply(404)
      await config.api.ai.chat(
        {
          messages: [{ role: "user", content: "Hello!" }],
          licenseKey: "test-key",
        },
        {
          status: 403,
        }
      )
    })

    it("handles no license key", async () => {
      await config.api.ai.chat(
        {
          messages: [{ role: "user", content: "Hello!" }],
          // @ts-expect-error - intentionally wrong
          licenseKey: undefined,
        },
        {
          status: 403,
        }
      )
    })

    it("handles text format", async () => {
      let usage = await getQuotaUsage()
      expect(usage._id).toBe(`quota_usage_${config.getTenantId()}`)
      expect(usage.monthly.current.budibaseAICredits).toBe(0)

      const gptResponse = generator.word()
      mockChatGPTResponse(gptResponse, { format: "text" })
      const { message } = await config.api.ai.chat({
        messages: [{ role: "user", content: "Hello!" }],
        format: "text",
        licenseKey: licenseKey,
      })
      expect(message).toBe(gptResponse)

      usage = await getQuotaUsage()
      expect(usage.monthly.current.budibaseAICredits).toBeGreaterThan(0)
    })

    it("handles json format", async () => {
      let usage = await getQuotaUsage()
      expect(usage._id).toBe(`quota_usage_${config.getTenantId()}`)
      expect(usage.monthly.current.budibaseAICredits).toBe(0)

      const gptResponse = JSON.stringify({
        [generator.word()]: generator.word(),
      })
      mockChatGPTResponse(gptResponse, { format: "json" })
      const { message } = await config.api.ai.chat({
        messages: [{ role: "user", content: "Hello!" }],
        format: "json",
        licenseKey: licenseKey,
      })
      expect(message).toBe(gptResponse)

      usage = await getQuotaUsage()
      expect(usage.monthly.current.budibaseAICredits).toBeGreaterThan(0)
    })

    it("handles structured outputs", async () => {
      let usage = await getQuotaUsage()
      expect(usage._id).toBe(`quota_usage_${config.getTenantId()}`)
      expect(usage.monthly.current.budibaseAICredits).toBe(0)

      const gptResponse = generator.guid()
      const structuredOutput = generator.word() as unknown as StructuredOutput
      ai.structuredOutputs[structuredOutput] = {
        key: generator.word(),
        validator: z.object({ name: z.string() }),
      }
      mockChatGPTResponse(gptResponse, { format: structuredOutput })
      const { message } = await config.api.ai.chat({
        messages: [{ role: "user", content: "Hello!" }],
        format: structuredOutput,
        licenseKey: licenseKey,
      })
      expect(message).toBe(gptResponse)

      usage = await getQuotaUsage()
      expect(usage.monthly.current.budibaseAICredits).toBeGreaterThan(0)
    })
  })
})
