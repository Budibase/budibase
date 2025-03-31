import { mockChatGPTResponse } from "../../../tests/utilities/mocks/ai/openai"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import nock from "nock"
import { configs, env, features, setEnv } from "@budibase/backend-core"
import {
  AIInnerConfig,
  ConfigType,
  License,
  PlanModel,
  PlanType,
  ProviderConfig,
} from "@budibase/types"
import { context } from "@budibase/backend-core"
import { mocks } from "@budibase/backend-core/tests"
import { MockLLMResponseFn } from "../../../tests/utilities/mocks/ai"
import { mockAnthropicResponse } from "../../../tests/utilities/mocks/ai/anthropic"

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
  mockLLMResponse: MockLLMResponseFn
  selfHostOnly?: boolean
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

const providers: TestSetup[] = [
  {
    name: "OpenAI API key",
    setup: async () => {
      return setEnv({
        OPENAI_API_KEY: "test-key",
      })
    },
    mockLLMResponse: mockChatGPTResponse,
    selfHostOnly: true,
  },
  {
    name: "OpenAI API key with custom config",
    setup: customAIConfig({ provider: "OpenAI", defaultModel: "gpt-4o-mini" }),
    mockLLMResponse: mockChatGPTResponse,
  },
  {
    name: "Anthropic API key with custom config",
    setup: customAIConfig({
      provider: "Anthropic",
      defaultModel: "claude-3-5-sonnet-20240620",
    }),
    mockLLMResponse: mockAnthropicResponse,
  },
  {
    name: "BudibaseAI",
    setup: budibaseAI(),
    mockLLMResponse: mockChatGPTResponse,
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

  describe.each(providers)(
    "provider: $name",
    ({ setup, mockLLMResponse, selfHostOnly }: TestSetup) => {
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
          mockLLMResponse(`return 42`)

          const { code } = await config.api.ai.generateJs({ prompt: "test" })
          expect(code).toBe("return 42")
        })

        it("handles correct markdown code response", async () => {
          mockLLMResponse(
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
          mockLLMResponse(
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
          mockLLMResponse("I'm sorry, you're quite right, etc.")
          const { code } = await config.api.ai.generateJs({ prompt: "test" })
          expect(code).toBe("")
        })

        it("handles LLM errors", async () => {
          mockLLMResponse(() => {
            throw new Error("LLM error")
          })
          await config.api.ai.generateJs({ prompt: "test" }, { status: 500 })
        })
      })

      describe("POST /api/ai/cron", () => {
        it("handles correct cron response", async () => {
          mockLLMResponse("0 0 * * *")

          const { message } = await config.api.ai.generateCron({
            prompt: "test",
          })
          expect(message).toBe("0 0 * * *")
        })

        it("handles expected LLM error", async () => {
          mockLLMResponse("Error generating cron: skill issue")

          await config.api.ai.generateCron(
            {
              prompt: "test",
            },
            { status: 400 }
          )
        })

        it("handles unexpected LLM error", async () => {
          mockLLMResponse(() => {
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

      !selfHostOnly &&
        describe("POST /api/ai/chat", () => {
          let cleanup: () => void
          beforeAll(() => {
            cleanup = setEnv({ SELF_HOSTED: false })
          })

          afterAll(() => {
            cleanup()
          })

          beforeEach(() => {
            const license: License = {
              plan: {
                type: PlanType.FREE,
                model: PlanModel.PER_USER,
                usesInvoicing: false,
              },
              features: [],
              quotas: {} as any,
              tenantId: config.tenantId,
            }
            nock(env.ACCOUNT_PORTAL_URL).get("/api/license").reply(200, license)
          })

          it("handles correct chat response", async () => {
            mockLLMResponse("Hi there!")
            const { message } = await config.api.ai.chat({
              messages: [{ role: "user", content: "Hello!" }],
              licenseKey: "test-key",
            })
            expect(message).toBe("Hi there!")
          })

          it("handles chat response error", async () => {
            mockLLMResponse(() => {
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
            nock(env.ACCOUNT_PORTAL_URL).get("/api/license").reply(404)
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
        })
    }
  )
})
