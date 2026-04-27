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

  it("sends file id filters when searching Gemini vector store", async () => {
    await withEnv({ GEMINI_API_KEY: "test-gemini-key" }, async () => {
      mockFetch.mockResolvedValue(response({ ok: true, status: 200, json: {} }))

      await searchGeminiFileStore({
        vectorStoreId: "vector-store-1",
        query: "what is policy",
        fileIds: ["file-1", "file-2"],
      })

      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.filters).toEqual({
        file_ids: ["file-1", "file-2"],
      })
    })
  })

  it("does not send file id filters when searching without source ids", async () => {
    await withEnv({ GEMINI_API_KEY: "test-gemini-key" }, async () => {
      mockFetch.mockResolvedValue(response({ ok: true, status: 200, json: {} }))

      await searchGeminiFileStore({
        vectorStoreId: "vector-store-1",
        query: "what is policy",
      })

      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.filters).toBeUndefined()
    })
  })
})
