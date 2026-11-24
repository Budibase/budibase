const mockFetch = jest.fn()
const mockGetKeySettings = jest.fn()

jest.mock("node-fetch", () => ({
  __esModule: true,
  default: (...args: any[]) => mockFetch(...args),
}))

jest.mock("../configs/litellm", () => ({
  getKeySettings: (...args: any[]) => mockGetKeySettings(...args),
}))

import { withEnv } from "../../../../environment"
import { withLiteLLMSessionId } from "../llm/requestSession"
import {
  createGeminiFileStore,
  deleteGeminiFileFromStore,
  deleteGeminiVectorStore,
  ingestGeminiFile,
  isGeminiFileSearchConfigured,
  searchGeminiFileStore,
} from "./geminiFileStore"

interface MockResponse {
  ok: boolean
  status: number
  json?: () => Promise<any>
  text?: () => Promise<string>
}

const response = ({
  ok,
  status,
  json,
  text,
}: {
  ok: boolean
  status: number
  json?: any
  text?: string
}): MockResponse => ({
  ok,
  status,
  json: async () => json,
  text: async () => text || "",
})

const fetchError = (message = "fetch failed") =>
  Object.assign(new Error(message), {
    name: "FetchError",
  })

describe("geminiFileStore", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetKeySettings.mockResolvedValue({ secretKey: "workspace-key" })
  })

  it("detects the configured LiteLLM Gemini credential", async () => {
    mockFetch.mockResolvedValue(response({ ok: true, status: 200 }))

    await expect(isGeminiFileSearchConfigured()).resolves.toBe(true)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/credentials/by_name/budibase-gemini"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer workspace-key",
        }),
      })
    )
  })

  it("reports Gemini file search as unconfigured when LiteLLM rejects the lookup", async () => {
    mockFetch.mockResolvedValue(response({ ok: false, status: 404 }))

    await expect(isGeminiFileSearchConfigured()).resolves.toBe(false)
  })

  it("propagates unexpected LiteLLM credential lookup failures", async () => {
    mockFetch.mockResolvedValue(
      response({ ok: false, status: 500, text: "LiteLLM unavailable" })
    )

    await expect(isGeminiFileSearchConfigured()).rejects.toMatchObject({
      message: "LiteLLM unavailable",
      status: 500,
    })
  })

  it("does not send the Gemini API key in vector store requests", async () => {
    await withEnv({ GEMINI_API_KEY: "test-gemini-key" }, async () => {
      mockFetch
        .mockResolvedValueOnce(
          response({ ok: true, status: 200, json: { id: "vector-store-1" } })
        )
        .mockResolvedValueOnce(response({ ok: true, status: 200 }))
        .mockResolvedValueOnce(
          response({
            ok: true,
            status: 200,
            json: {
              id: "ingest-1",
              status: "completed",
              vector_store_id: "vector-store-1",
              file_id: "file-1",
            },
          })
        )
        .mockResolvedValueOnce(
          response({ ok: true, status: 200, json: { data: [] } })
        )
        .mockResolvedValueOnce(response({ ok: true, status: 200 }))

      await createGeminiFileStore("Support Docs")
      await deleteGeminiVectorStore("vector-store-1")
      await ingestGeminiFile({
        vectorStoreId: "vector-store-1",
        filename: "notes.txt",
        buffer: Buffer.from("hello"),
      })
      await searchGeminiFileStore({
        vectorStoreId: "vector-store-1",
        query: "hello",
      })
      await deleteGeminiFileFromStore({
        vectorStoreId: "vector-store-1",
        fileId: "file-1",
      })

      expect(mockFetch).toHaveBeenCalledTimes(5)
      for (const [url, init] of mockFetch.mock.calls) {
        expect(String(url)).not.toContain("test-gemini-key")
        expect(JSON.stringify(init?.headers)).not.toContain("test-gemini-key")
        expect(init?.headers).toMatchObject({
          "Content-Type": "application/json",
          Authorization: "Bearer workspace-key",
        })
        expect(String(init?.body)).not.toContain("api_key")
        expect(String(init?.body)).not.toContain("test-gemini-key")
      }
    })
  })

  it("uses the vector store's registered credential when searching", async () => {
    mockFetch.mockResolvedValue(
      response({ ok: true, status: 200, json: { data: [] } })
    )

    await searchGeminiFileStore({
      vectorStoreId: "vector-store-1",
      query: "hello",
    })

    const [, init] = mockFetch.mock.calls[0]
    expect(JSON.parse(String(init.body))).not.toHaveProperty(
      "litellm_credential_name"
    )
  })

  it("uses upstream response status when ingest fails", async () => {
    await withEnv({ GEMINI_API_KEY: "test-gemini-key" }, async () => {
      mockFetch.mockResolvedValue(
        response({ ok: false, status: 503, text: "upstream unavailable" })
      )

      await expect(
        ingestGeminiFile({
          vectorStoreId: "vector-store-1",
          filename: "notes.txt",
          buffer: Buffer.from("hello"),
        })
      ).rejects.toMatchObject({
        status: 503,
        message: "upstream unavailable",
      })
    })
  })

  it.each([
    {
      status: 403,
      message:
        "Gemini file store is inaccessible (403 Forbidden). Use 'Reset store' to recreate it.",
    },
    {
      status: 404,
      message:
        "Gemini file store was not found (404). Use 'Reset store' to recreate it.",
    },
  ])(
    "offers store reset for a direct HTTP $status ingestion failure",
    async ({ status, message }) => {
      await withEnv({ GEMINI_API_KEY: "test-gemini-key" }, async () => {
        mockFetch.mockResolvedValue(
          response({ ok: false, status, text: "Upstream request failed" })
        )

        await expect(
          ingestGeminiFile({
            vectorStoreId: "vector-store-1",
            filename: "notes.txt",
            buffer: Buffer.from("hello"),
          })
        ).rejects.toMatchObject({ status, message })
      })
    }
  )

  it("throws when ingest succeeds without returning a file_id", async () => {
    await withEnv({ GEMINI_API_KEY: "test-gemini-key" }, async () => {
      mockFetch.mockResolvedValue(response({ ok: true, status: 200, json: {} }))

      await expect(
        ingestGeminiFile({
          vectorStoreId: "vector-store-1",
          filename: "notes.txt",
          buffer: Buffer.from("hello"),
        })
      ).rejects.toMatchObject({
        status: 500,
        message: "Gemini ingest did not return file_id",
      })
    })
  })

  it("throws ingest error when upstream returns failed status", async () => {
    await withEnv({ GEMINI_API_KEY: "test-gemini-key" }, async () => {
      mockFetch.mockResolvedValue(
        response({
          ok: true,
          status: 200,
          json: {
            id: "ingest-1",
            status: "failed",
            vector_store_id: "vector-store-1",
            file_id: "",
            error: "Ingestion failed upstream",
          },
        })
      )

      await expect(
        ingestGeminiFile({
          vectorStoreId: "vector-store-1",
          filename: "notes.txt",
          buffer: Buffer.from("hello"),
        })
      ).rejects.toMatchObject({
        status: 500,
        message: "Ingestion failed upstream",
      })
    })
  })

  it("throws 403 with a friendly message when the file store is inaccessible", async () => {
    await withEnv({ GEMINI_API_KEY: "test-gemini-key" }, async () => {
      mockFetch.mockResolvedValue(
        response({
          ok: true,
          status: 200,
          json: {
            id: "ingest-1",
            status: "failed",
            vector_store_id: "",
            file_id: "",
            error:
              "Client error '403 Forbidden' for url 'https://generativelanguage.googleapis.com/upload/v1beta/fileSearchStores/agent-files-abc:uploadToFileSearchStore'",
          },
        })
      )

      await expect(
        ingestGeminiFile({
          vectorStoreId: "agent-files-abc",
          filename: "notes.txt",
          buffer: Buffer.from("hello"),
        })
      ).rejects.toMatchObject({
        status: 403,
        message:
          "Gemini file store is inaccessible (403 Forbidden). Use 'Reset store' to recreate it.",
      })
    })
  })

  it("throws 404 with a friendly message when the file store does not exist", async () => {
    await withEnv({ GEMINI_API_KEY: "test-gemini-key" }, async () => {
      mockFetch.mockResolvedValue(
        response({
          ok: true,
          status: 200,
          json: {
            id: "ingest-1",
            status: "failed",
            vector_store_id: "",
            file_id: "",
            error:
              "Client error '404 Not Found' for url 'https://generativelanguage.googleapis.com/upload/v1beta/fileSearchStores/agent-files-missing:uploadToFileSearchStore'",
          },
        })
      )

      await expect(
        ingestGeminiFile({
          vectorStoreId: "agent-files-missing",
          filename: "notes.txt",
          buffer: Buffer.from("hello"),
        })
      ).rejects.toMatchObject({
        status: 404,
        message:
          "Gemini file store was not found (404). Use 'Reset store' to recreate it.",
      })
    })
  })

  it("does not throw when deleting a file that already does not exist", async () => {
    await withEnv({ GEMINI_API_KEY: "test-gemini-key" }, async () => {
      mockFetch.mockResolvedValue(
        response({ ok: false, status: 404, text: "" })
      )

      await expect(
        deleteGeminiFileFromStore({
          vectorStoreId: "vector-store-1",
          fileId: "missing-file",
        })
      ).resolves.toBeUndefined()
    })
  })

  it("retries transient search failures", async () => {
    await withEnv({ GEMINI_API_KEY: "test-gemini-key" }, async () => {
      mockFetch
        .mockResolvedValueOnce(
          response({ ok: false, status: 503, text: "upstream unavailable" })
        )
        .mockResolvedValueOnce(
          response({
            ok: true,
            status: 200,
            json: {
              data: [
                {
                  file_id: "file-1",
                  filename: "notes.txt",
                  score: 0.8,
                  content: [{ type: "text", text: "hello" }],
                },
              ],
            },
          })
        )

      const result = await searchGeminiFileStore({
        vectorStoreId: "vector-store-1",
        query: "hello",
      })

      expect(result).toEqual([
        {
          file_id: "file-1",
          filename: "notes.txt",
          score: 0.8,
          content: [{ type: "text", text: "hello" }],
        },
      ])
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  it("includes litellm_session_id when a session context is active", async () => {
    await withEnv({ GEMINI_API_KEY: "test-gemini-key" }, async () => {
      let requestBody: Record<string, unknown> | undefined
      mockFetch.mockResolvedValueOnce(
        response({
          ok: true,
          status: 200,
          json: { data: [] },
        })
      )

      await withLiteLLMSessionId("chatconvo_123", async () =>
        searchGeminiFileStore({
          vectorStoreId: "vector-store-1",
          query: "hello",
        })
      )

      const [, init] = mockFetch.mock.calls[0]
      requestBody = JSON.parse(String(init?.body))
      expect(requestBody?.model).toBe("gemini/gemini-3.8-flash")
      expect(requestBody?.litellm_session_id).toBe("chatconvo_123")
      expect(requestBody?.metadata).toEqual({ session_id: "chatconvo_123" })
    })
  })

  it("retries transient fetch errors", async () => {
    await withEnv({ GEMINI_API_KEY: "test-gemini-key" }, async () => {
      mockFetch.mockRejectedValueOnce(fetchError()).mockResolvedValueOnce(
        response({
          ok: true,
          status: 200,
          json: { data: [] },
        })
      )

      await expect(
        searchGeminiFileStore({
          vectorStoreId: "vector-store-1",
          query: "hello",
        })
      ).resolves.toEqual([])
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  it("does not retry non-fetch errors", async () => {
    await withEnv({ GEMINI_API_KEY: "test-gemini-key" }, async () => {
      mockGetKeySettings.mockRejectedValueOnce(new Error("config failed"))

      await expect(
        searchGeminiFileStore({
          vectorStoreId: "vector-store-1",
          query: "hello",
        })
      ).rejects.toThrow("config failed")
      expect(mockGetKeySettings).toHaveBeenCalledTimes(1)
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  it("does not retry search validation failures", async () => {
    await withEnv({ GEMINI_API_KEY: "test-gemini-key" }, async () => {
      mockFetch.mockResolvedValue(
        response({ ok: false, status: 400, text: "bad request" })
      )

      await expect(
        searchGeminiFileStore({
          vectorStoreId: "vector-store-1",
          query: "hello",
        })
      ).rejects.toMatchObject({
        status: 400,
        message: "bad request",
      })
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })
})
