import { withEnv } from "@budibase/backend-core"
import { BUDIBASE_AI_PROVIDER_ID } from "@budibase/types"
import sdk from "../../.."
import { createLLM } from "./index"
import { createBBAIClient } from "./bbai"
import { createLiteLLMOpenAI } from "./litellm"

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

jest.mock("./bbai", () => ({
  createBBAIClient: jest.fn(),
}))

jest.mock("./litellm", () => ({
  createLiteLLMOpenAI: jest.fn(),
}))

describe("createLLM", () => {
  const findConfigMock = sdk.ai.configs.find as jest.MockedFunction<
    typeof sdk.ai.configs.find
  >
  const createBBAIClientMock = createBBAIClient as jest.MockedFunction<
    typeof createBBAIClient
  >
  const createLiteLLMOpenAIMock = createLiteLLMOpenAI as jest.MockedFunction<
    typeof createLiteLLMOpenAI
  >

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("rejects missing config id", async () => {
    await expect(createLLM("")).rejects.toMatchObject({
      status: 422,
      message: "Config id not found",
    })
  })

  it("rejects when config is missing", async () => {
    findConfigMock.mockResolvedValue(undefined as any)

    await expect(createLLM("missing-id")).rejects.toMatchObject({
      status: 422,
      message: 'Config id "missing-id" not found',
    })
  })

  it("uses Budibase AI when provider is Budibase and not self-hosted", async () => {
    await withEnv({ SELF_HOSTED: false }, async () => {
      findConfigMock.mockResolvedValue({
        provider: BUDIBASE_AI_PROVIDER_ID,
        model: "budibase/gpt-5-mini",
      } as any)

      const expected = { chat: "chat" }
      createBBAIClientMock.mockResolvedValue(expected as any)

      const result = await createLLM("config-1")

      expect(createBBAIClient).toHaveBeenCalledWith("budibase/gpt-5-mini")
      expect(createLiteLLMOpenAI).not.toHaveBeenCalled()
      expect(result).toBe(expected)
    })
  })

  it("uses LiteLLM for non-Budibase providers", async () => {
    findConfigMock.mockResolvedValue({
      provider: "openai",
      model: "gpt-5-mini",
      liteLLMModelId: "gpt-5-mini",
    } as any)

    const expected = { chat: "chat", embedding: "embedding" }
    createLiteLLMOpenAIMock.mockResolvedValue(expected as any)

    const result = await createLLM("config-2", "session-1")

    expect(createLiteLLMOpenAI).toHaveBeenCalledWith(
      expect.objectContaining({ provider: "openai" }),
      "session-1",
      undefined
    )
    expect(createBBAIClient).not.toHaveBeenCalled()
    expect(result).toBe(expected)
  })
})
