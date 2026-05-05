const mockFetch = jest.fn()
const mockGetKeySettings = jest.fn()

jest.mock("node-fetch", () => ({
  __esModule: true,
  default: (...args: any[]) => mockFetch(...args),
}))

jest.mock("../configs/litellm", () => ({
  getKeySettings: (...args: any[]) => mockGetKeySettings(...args),
}))

import { setEnv, withEnv } from "../../../../environment"
import {
  createGeminiFileStore,
  deleteGeminiFileFromStore,
  ingestGeminiFile,
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

  it("throws a 400 when GEMINI_API_KEY is missing", async () => {
    const cleanup = setEnv({ GEMINI_API_KEY: undefined as any })
    try {
      await expect(createGeminiFileStore("Support Docs")).rejects.toMatchObject(
        {
          status: 400,
          message:
            "Gemini File Search failed. Set GEMINI_API_KEY on your local environment",
        }
      )
      expect(mockFetch).not.toHaveBeenCalled()
    } finally {
      cleanup()
    }
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
