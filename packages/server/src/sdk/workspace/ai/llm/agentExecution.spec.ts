import { withEnv as withCoreEnv } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { BUDIBASE_AI_PROVIDER_ID } from "@budibase/types"
import { mockChatGPTResponse } from "../../../../tests/utilities/mocks/ai/openai"
import { resetHttpMocking } from "../../../../tests/jestEnv"
import { withEnv } from "../../../../environment"
import sdk from "../../.."
import { createLLM } from "./index"

// Only the config lookup and quotas are mocked - createLLM, createBBAIClient,
// getBBAIKey and the LiteLLM round-trip run for real, exercising the provider
// resolution path shared by every agent execution path.
jest.mock("../../..", () => ({
  __esModule: true,
  default: {
    ai: {
      configs: {
        find: jest.fn(),
      },
    },
  },
}))

jest.mock("@budibase/pro", () => {
  const actual = jest.requireActual("@budibase/pro")
  return {
    ...actual,
    quotas: {
      ...actual.quotas,
      throwIfBudibaseAICreditsExceeded: jest.fn().mockResolvedValue(undefined),
      incrementBudibaseAICredits: jest.fn(),
    },
  }
})

describe("agent LLM resolution across execution paths", () => {
  const findConfigMock = sdk.ai.configs.find as jest.MockedFunction<
    typeof sdk.ai.configs.find
  >
  const incrementCreditsMock =
    quotas.incrementBudibaseAICredits as jest.MockedFunction<
      typeof quotas.incrementBudibaseAICredits
    >

  beforeEach(async () => {
    await resetHttpMocking()
    findConfigMock.mockResolvedValue({
      _id: "config-1",
      provider: BUDIBASE_AI_PROVIDER_ID,
      model: "budibase/v1",
    } as any)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("fails with a clear, actionable error when the Budibase AI key is missing", async () => {
    await withCoreEnv({ SELF_HOSTED: false }, async () => {
      await withEnv({ BBAI_LITELLM_KEY: undefined }, async () => {
        await expect(createLLM("config-1", "session-1")).rejects.toThrow(
          /Budibase AI is not configured.*BBAI_LITELLM_KEY/
        )
      })
    })

    expect(incrementCreditsMock).not.toHaveBeenCalled()
  })

  it("resolves the client and generates when the Budibase AI key is present", async () => {
    mockChatGPTResponse("agent answer")

    await withCoreEnv({ SELF_HOSTED: false }, async () => {
      await withEnv({ BBAI_LITELLM_KEY: "sk-test-key" }, async () => {
        const { chat } = await createLLM("config-1", "session-1")
        const result = await chat.doGenerate({
          prompt: [
            {
              role: "user",
              content: [{ type: "text", text: "hello" }],
            },
          ],
        })

        expect(result.content).toBeDefined()
      })
    })

    expect(incrementCreditsMock).toHaveBeenCalledTimes(1)
  })
})
