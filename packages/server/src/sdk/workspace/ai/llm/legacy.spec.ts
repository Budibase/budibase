import { withEnv } from "@budibase/backend-core"
import { ai, licensing } from "@budibase/pro"
import { createAzure } from "@ai-sdk/azure"
import { createOpenAI } from "@ai-sdk/openai"
import { createBBAIClient } from "./bbai"
import { createLegacyLLM } from "./legacy"

jest.mock("@ai-sdk/openai", () => ({
  createOpenAI: jest.fn(),
}))

jest.mock("@ai-sdk/azure", () => ({
  createAzure: jest.fn(),
}))

jest.mock("@budibase/pro", () => {
  const actual = jest.requireActual("@budibase/pro")
  return {
    ...actual,
    ai: {
      ...actual.ai,
      getLLMConfig: jest.fn(),
    },
    licensing: {
      ...actual.licensing,
      keys: {
        ...actual.licensing.keys,
        getLicenseKey: jest.fn(),
      },
    },
  }
})

jest.mock("./bbai", () => ({
  createBBAIClient: jest.fn(),
}))

describe("createLegacyLLM", () => {
  const getLLMConfigMock = ai.getLLMConfig as jest.MockedFunction<
    typeof ai.getLLMConfig
  >
  const getLicenseKeyMock = licensing.keys.getLicenseKey as jest.MockedFunction<
    typeof licensing.keys.getLicenseKey
  >
  const createBBAIClientMock = createBBAIClient as jest.MockedFunction<
    typeof createBBAIClient
  >
  const createOpenAIMock = createOpenAI as jest.MockedFunction<
    typeof createOpenAI
  >
  const createAzureMock = createAzure as jest.MockedFunction<typeof createAzure>

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("returns undefined when no legacy config is available", async () => {
    getLLMConfigMock.mockResolvedValue(undefined)

    await expect(createLegacyLLM()).resolves.toBeUndefined()
  })

  it("uses local BBAI in cloud for BudibaseAI", async () => {
    getLLMConfigMock.mockResolvedValue({
      provider: "BudibaseAI",
      model: "gpt-5-mini",
    })
    const expected = { chat: "chat", embedding: "embedding" } as any
    createBBAIClientMock.mockResolvedValue(expected)

    await withEnv({ SELF_HOSTED: false }, async () => {
      const result = await createLegacyLLM()

      expect(createBBAIClientMock).toHaveBeenCalledWith("legacy/gpt-5-mini")
      expect(createOpenAIMock).not.toHaveBeenCalled()
      expect(createAzureMock).not.toHaveBeenCalled()
      expect(result).toBe(expected)
    })
  })

  it("uses cloud BBAI in self-host for BudibaseAI", async () => {
    getLLMConfigMock.mockResolvedValue({
      provider: "BudibaseAI",
      model: "gpt-5-mini",
    })
    getLicenseKeyMock.mockResolvedValue("license-key")

    const chat = jest.fn().mockReturnValue("chat-model")
    const embedding = jest.fn().mockReturnValue("embedding-model")
    createOpenAIMock.mockReturnValue({ chat, embedding } as any)

    await withEnv(
      { SELF_HOSTED: true, BUDICLOUD_URL: "https://budibase.app" },
      async () => {
        const result = await createLegacyLLM()

        expect(createBBAIClientMock).not.toHaveBeenCalled()
        expect(createOpenAIMock).toHaveBeenCalledWith({
          baseURL: "https://budibase.app/api/ai",
          apiKey: "license-key",
        })
        expect(chat).toHaveBeenCalledWith("legacy/gpt-5-mini")
        expect(embedding).toHaveBeenCalledWith("legacy/gpt-5-mini")
        expect(result).toEqual({
          chat: "chat-model",
          embedding: "embedding-model",
        })
      }
    )
  })

  it("throws when license key is missing for self-host BudibaseAI", async () => {
    getLLMConfigMock.mockResolvedValue({
      provider: "BudibaseAI",
      model: "gpt-5-mini",
    })
    getLicenseKeyMock.mockResolvedValue(undefined)

    await withEnv(
      { SELF_HOSTED: true, BUDICLOUD_URL: "https://budibase.app" },
      async () => {
        await expect(createLegacyLLM()).rejects.toMatchObject({
          status: 422,
          message: "No license key found",
        })
      }
    )
  })
})
