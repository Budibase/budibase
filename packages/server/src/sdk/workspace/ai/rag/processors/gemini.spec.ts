const mockSearchGeminiFileStore = jest.fn()
const mockIngestGeminiFile = jest.fn()
const mockDeleteGeminiFileFromStore = jest.fn()
const mockUpdateKnowledgeBaseFile = jest.fn()

jest.mock("../../knowledgeBase/geminiFileStore", () => ({
  searchGeminiFileStore: (...args: any[]) => mockSearchGeminiFileStore(...args),
  ingestGeminiFile: (...args: any[]) => mockIngestGeminiFile(...args),
  deleteGeminiFileFromStore: (...args: any[]) =>
    mockDeleteGeminiFileFromStore(...args),
}))

jest.mock("../../knowledgeBase", () => ({
  updateKnowledgeBaseFile: (...args: any[]) =>
    mockUpdateKnowledgeBaseFile(...args),
}))

import { KnowledgeBaseType, type KnowledgeBase } from "@budibase/types"
import { GeminiRagProcessor } from "./gemini"

describe("GeminiRagProcessor", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createProcessor = () =>
    new GeminiRagProcessor({
      _id: "kb_1",
      name: "KB",
      type: KnowledgeBaseType.GEMINI,
      config: {
        googleFileStoreId: "store_1",
      },
    } satisfies KnowledgeBase)

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
      },
    ])
  })

  it("extracts pageNumber from direct page fields", async () => {
    mockSearchGeminiFileStore.mockResolvedValue([
      {
        file_id: "gemini-file-1",
        filename: "color.pdf",
        score: 0.9,
        pageNumber: 2,
        content: [{ type: "text", text: "Dom's favourite colour is magenta." }],
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

    const result = await processor.search("What's Dom's favourite color?")

    expect(result).toEqual([
      {
        source: "gemini-file-1",
        chunkText: "Dom's favourite colour is magenta.",
        pageNumber: 2,
      },
    ])
  })

  it("extracts pageNumber from Gemini retrievedContext fields", async () => {
    mockSearchGeminiFileStore.mockResolvedValue([
      {
        id: "gemini-file-1",
        filename: "color.pdf",
        score: 0.9,
        content: [
          {
            type: "text",
            retrievedContext: {
              text: "Dom's favourite colour is magenta.",
              pageNumber: 2,
            },
          },
        ],
      },
    ])

    const result = await createProcessor().search(
      "What's Dom's favourite color?"
    )

    expect(result).toEqual([
      {
        source: "color.pdf",
        chunkText: "Dom's favourite colour is magenta.",
        pageNumber: 2,
      },
    ])
  })

  it("converts zero-based page values to page 1", async () => {
    mockSearchGeminiFileStore.mockResolvedValue([
      {
        file_id: "gemini-file-1",
        filename: "color.pdf",
        score: 0.9,
        metadata: {
          page: 0,
        },
        content: [{ type: "text", text: "Dom's favourite colour is magenta." }],
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

    const result = await processor.search("What's Dom's favourite color?")

    expect(result).toEqual([
      {
        source: "gemini-file-1",
        chunkText: "Dom's favourite colour is magenta.",
        pageNumber: 1,
      },
    ])
  })

  it("extracts pageNumber from nested page_no metadata", async () => {
    mockSearchGeminiFileStore.mockResolvedValue([
      {
        file_id: "gemini-file-1",
        filename: "color.pdf",
        score: 0.9,
        content: [
          {
            type: "text",
            text: "Dom's favourite colour is magenta.",
            citation: {
              source: {
                page_no: 2,
              },
            },
          },
        ],
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

    const result = await processor.search("What's Dom's favourite color?")

    expect(result).toEqual([
      {
        source: "gemini-file-1",
        chunkText: "Dom's favourite colour is magenta.",
        pageNumber: 2,
      },
    ])
  })

  it("extracts pageNumber from attributes key/value pairs", async () => {
    mockSearchGeminiFileStore.mockResolvedValue([
      {
        file_id: "gemini-file-1",
        filename: "color.pdf",
        score: 0.9,
        attributes: [
          {
            key: "page_number",
            value: 2,
          },
        ],
        content: [{ type: "text", text: "Dom's favourite colour is magenta." }],
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

    const result = await processor.search("What's Dom's favourite color?")

    expect(result).toEqual([
      {
        source: "gemini-file-1",
        chunkText: "Dom's favourite colour is magenta.",
        pageNumber: 2,
      },
    ])
  })
})
