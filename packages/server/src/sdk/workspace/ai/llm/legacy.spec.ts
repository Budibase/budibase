import { withEnv } from "@budibase/backend-core"
import { ai, licensing } from "@budibase/pro"
import { createAzure } from "@ai-sdk/azure"
import { createOpenAI } from "@ai-sdk/openai"
import { Readable } from "stream"
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
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it("returns undefined when no legacy config is available", async () => {
    getLLMConfigMock.mockResolvedValue(undefined)

    await expect(createLegacyLLM()).resolves.toBeUndefined()
  })

  it("normalizes OpenAI base URL to include /v1", async () => {
    getLLMConfigMock.mockResolvedValue({
      provider: "OpenAI",
      model: "gpt-5-mini",
      apiKey: "test-key",
      baseUrl: "https://api.openai.com",
    })

    const chat = jest.fn().mockReturnValue("chat-model")
    const embedding = jest.fn().mockReturnValue("embedding-model")
    createOpenAIMock.mockReturnValue({ chat, embedding } as any)

    const result = await createLegacyLLM()

    expect(createOpenAIMock).toHaveBeenCalledWith({
      baseURL: "https://api.openai.com/v1",
      apiKey: "test-key",
    })
    expect(chat).toHaveBeenCalledWith("gpt-5-mini")
    expect(embedding).toHaveBeenCalledWith("gpt-5-mini")
    expect(result).toEqual({
      chat: "chat-model",
      embedding: "embedding-model",
      uploadFile: expect.toBeFunction(),
    })
  })

  it("does not modify OpenAI base URL when /v1 already exists", async () => {
    getLLMConfigMock.mockResolvedValue({
      provider: "OpenAI",
      model: "gpt-5-mini",
      apiKey: "test-key",
      baseUrl: "https://api.openai.com/v1",
    })

    const chat = jest.fn().mockReturnValue("chat-model")
    const embedding = jest.fn().mockReturnValue("embedding-model")
    createOpenAIMock.mockReturnValue({ chat, embedding } as any)

    await createLegacyLLM()

    expect(createOpenAIMock).toHaveBeenCalledWith({
      baseURL: "https://api.openai.com/v1",
      apiKey: "test-key",
    })
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

      expect(createBBAIClientMock).toHaveBeenCalledWith(
        "budibase/legacy/gpt-5-mini"
      )
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
        expect(chat).toHaveBeenCalledWith("budibase/legacy/gpt-5-mini")
        expect(embedding).toHaveBeenCalledWith("budibase/legacy/gpt-5-mini")
        expect(result).toEqual({
          chat: "chat-model",
          embedding: "embedding-model",
          uploadFile: expect.toBeFunction(),
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

  it("does not provide uploadFile for Azure", async () => {
    getLLMConfigMock.mockResolvedValue({
      provider: "AzureOpenAI",
      model: "gpt-5-mini",
      apiKey: "test-key",
      baseUrl: "https://azure.openai.test",
    })

    const chat = jest.fn().mockReturnValue("chat-model")
    const embedding = jest.fn().mockReturnValue("embedding-model")
    createAzureMock.mockReturnValue({ chat, embedding } as any)

    const result = await createLegacyLLM()

    expect(result).toEqual({
      chat: "chat-model",
      embedding: "embedding-model",
      uploadFile: undefined,
    })
  })

  it("uploads files to /files for OpenAI legacy providers", async () => {
    getLLMConfigMock.mockResolvedValue({
      provider: "OpenAI",
      model: "gpt-5-mini",
      apiKey: "test-key",
      baseUrl: "https://api.openai.com",
    })

    const chat = jest.fn().mockReturnValue("chat-model")
    const embedding = jest.fn().mockReturnValue("embedding-model")
    createOpenAIMock.mockReturnValue({ chat, embedding } as any)

    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      json: async () => ({ id: "file-123" }),
    } as any)

    const result = await createLegacyLLM()
    const fileId = await result!.uploadFile!(
      Readable.from(Buffer.from("test")),
      "doc.pdf"
    )

    expect(fileId).toBe("file-123")
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://api.openai.com/v1/files",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer test-key",
        },
      })
    )
  })

  it("uploads files through Budibase cloud endpoint in self-host mode", async () => {
    getLLMConfigMock.mockResolvedValue({
      provider: "BudibaseAI",
      model: "gpt-5-mini",
    })
    getLicenseKeyMock.mockResolvedValue("license-key")

    const chat = jest.fn().mockReturnValue("chat-model")
    const embedding = jest.fn().mockReturnValue("embedding-model")
    createOpenAIMock.mockReturnValue({ chat, embedding } as any)

    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ file: "file-123" }),
    } as any)

    await withEnv(
      { SELF_HOSTED: true, BUDICLOUD_URL: "https://budibase.app" },
      async () => {
        const result = await createLegacyLLM()
        const fileId = await result!.uploadFile!(
          Readable.from(Buffer.from("test")),
          "doc.pdf"
        )
        expect(fileId).toBe("file-123")
      }
    )

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://budibase.app/api/ai/upload-file",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    )
  })
})
