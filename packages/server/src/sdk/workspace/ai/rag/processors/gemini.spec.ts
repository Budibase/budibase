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

const knowledgeBase = {
  _id: "kb_1",
  name: "KB",
  type: KnowledgeBaseType.GEMINI,
  config: {
    googleFileStoreId: "store_1",
  },
} satisfies KnowledgeBase

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

    const processor = new GeminiRagProcessor(knowledgeBase)

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

    const processor = new GeminiRagProcessor(knowledgeBase)

    const result = await processor.search("What is policy?")

    expect(result).toEqual([
      {
        source: "policy.md",
        chunkText: "4-day policy",
      },
    ])
  })

  it("reads chunk text from retrievedContext fields", async () => {
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
      },
    ])
  })

  it("extracts source from content-level retrievedContext", async () => {
    mockSearchGeminiFileStore.mockResolvedValue([
      {
        id: "row-1",
        score: 0.9,
        content: [
          {
            type: "text",
            retrievedContext: {
              mediaId: "gemini-file-42",
              text: "Policies are reviewed quarterly.",
            },
          },
        ],
      },
    ])

    const result = await createProcessor().search(
      "How often are policies reviewed?"
    )

    expect(result).toEqual([
      {
        source: "gemini-file-42",
        chunkText: "Policies are reviewed quarterly.",
      },
    ])
  })

  it("extracts source from row-level retrievedContext media id", async () => {
    mockSearchGeminiFileStore.mockResolvedValue([
      {
        id: "row-1",
        score: 0.9,
        retrievedContext: {
          mediaId: "gemini-file-42",
        },
        content: [
          {
            type: "text",
            retrievedContext: {
              text: "Policies are reviewed quarterly.",
            },
          },
        ],
      },
    ])

    const result = await createProcessor().search(
      "How often are policies reviewed?"
    )

    expect(result).toEqual([
      {
        source: "gemini-file-42",
        chunkText: "Policies are reviewed quarterly.",
      },
    ])
  })
})
