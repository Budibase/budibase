const mockSearchGeminiFileStore = jest.fn()
const mockIngestGeminiFile = jest.fn()
const mockDeleteGeminiFileFromStore = jest.fn()
const mockUpdateKnowledgeBaseFile = jest.fn()
const mockGetKnowledgeBaseFileOrThrow = jest.fn()

jest.mock("../../knowledgeBase/geminiFileStore", () => ({
  searchGeminiFileStore: (...args: any[]) => mockSearchGeminiFileStore(...args),
  ingestGeminiFile: (...args: any[]) => mockIngestGeminiFile(...args),
  deleteGeminiFileFromStore: (...args: any[]) =>
    mockDeleteGeminiFileFromStore(...args),
}))

jest.mock("../../knowledgeBase", () => ({
  updateKnowledgeBaseFile: (...args: any[]) =>
    mockUpdateKnowledgeBaseFile(...args),
  getKnowledgeBaseFileOrThrow: (...args: any[]) =>
    mockGetKnowledgeBaseFileOrThrow(...args),
}))

import { KnowledgeBaseType } from "@budibase/types"
import { GeminiRagProcessor } from "./gemini"

describe("GeminiRagProcessor", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetKnowledgeBaseFileOrThrow.mockImplementation(async fileId => ({
      _id: fileId,
      _rev: "1-rev",
      knowledgeBaseId: "kb_1",
      filename: "policy.pdf",
      objectStoreKey: "obj",
      ragSourceId: "source-1",
      status: "ready",
      uploadedBy: "user_1",
    }))
  })

  it("maps search sourceId from Gemini file_id", async () => {
    mockSearchGeminiFileStore.mockResolvedValue([
      {
        file_id: "gemini-file-1",
        filename: "policy.md",
        score: 0.9,
        content: [{ type: "text", text: "4-day policy" }],
      },
    ])

    const processor = new GeminiRagProcessor({
      _id: "kb_1",
      name: "KB",
      type: KnowledgeBaseType.GEMINI,
      config: {
        googleFileStoreId: "store_1",
      },
    } as any)

    const result = await processor.search("What is policy?")

    expect(result).toEqual([
      {
        source: "gemini-file-1",
        chunkText: "4-day policy",
        previewScore: 0.9,
      },
    ])
  })

  it("falls back to filename when Gemini file_id is missing", async () => {
    mockSearchGeminiFileStore.mockResolvedValue([
      {
        file_id: null,
        filename: "policy.md",
        score: 0.9,
        content: [{ type: "text", text: "4-day policy" }],
      },
    ])

    const processor = new GeminiRagProcessor({
      _id: "kb_1",
      name: "KB",
      type: KnowledgeBaseType.GEMINI,
      config: {
        googleFileStoreId: "store_1",
      },
    } as any)

    const result = await processor.search("What is policy?")

    expect(result).toEqual([
      {
        source: "policy.md",
        chunkText: "4-day policy",
        previewScore: 0.9,
      },
    ])
  })

  it("maps preview metadata when Gemini returns image and page", async () => {
    mockSearchGeminiFileStore.mockResolvedValue([
      {
        file_id: "gemini-file-1",
        filename: "policy.pdf",
        score: 0.82,
        page: 3,
        image_url: "https://example.com/preview/page-3.png",
        content: [{ type: "text", text: "Policy section" }],
      },
    ])

    const processor = new GeminiRagProcessor({
      _id: "kb_1",
      name: "KB",
      type: KnowledgeBaseType.GEMINI,
      config: {
        googleFileStoreId: "store_1",
      },
    } as any)

    const result = await processor.search("Where is this policy section?")

    expect(result).toEqual([
      {
        source: "gemini-file-1",
        chunkText: "Policy section",
        previewUrl: "https://example.com/preview/page-3.png",
        previewPage: 3,
        previewScore: 0.82,
      },
    ])
  })
})
