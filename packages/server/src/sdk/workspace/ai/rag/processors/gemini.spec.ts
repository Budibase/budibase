const mockSearchGeminiFileStore = jest.fn()
const mockIngestGeminiFile = jest.fn()
const mockDeleteGeminiFileFromStore = jest.fn()
const mockUpdateKnowledgeBaseFile = jest.fn()
const mockGetDefaultLLMOrThrow = jest.fn()
const mockGenerateText = jest.fn()
const mockPdfGetText = jest.fn()
const mockPdfParse = jest.fn()

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

jest.mock("../../llm", () => ({
  getDefaultLLMOrThrow: (...args: any[]) => mockGetDefaultLLMOrThrow(...args),
}))

jest.mock("ai", () => ({
  generateText: (...args: any[]) => mockGenerateText(...args),
}))

jest.mock("pdf-parse", () => ({
  PDFParse: function (...args: unknown[]) {
    return mockPdfParse(...args)
  },
}))

import {
  KnowledgeBaseFile,
  KnowledgeBaseFileStatus,
  KnowledgeBaseType,
} from "@budibase/types"
import { GeminiRagProcessor } from "./gemini"

const createProcessor = () =>
  new GeminiRagProcessor({
    _id: "kb_1",
    name: "KB",
    type: KnowledgeBaseType.GEMINI,
    config: {
      googleFileStoreId: "store_1",
    },
  } as const)

const createFile = (id: string): KnowledgeBaseFile => ({
  _id: id,
  _rev: "1-rev",
  knowledgeBaseId: "kb_1",
  filename: "policy.pdf",
  mimetype: "application/pdf",
  objectStoreKey: "obj/key",
  ragSourceId: "source_before",
  status: KnowledgeBaseFileStatus.PROCESSING,
  uploadedBy: "user_1",
})

describe("GeminiRagProcessor", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetDefaultLLMOrThrow.mockResolvedValue({
      chat: "mock-chat-model",
      providerOptions: jest.fn(),
    })
    mockGenerateText.mockResolvedValue({ text: "Generated summary" })
    mockPdfGetText.mockResolvedValue({ text: "PDF contents" })
    mockPdfParse.mockImplementation(() => ({ getText: mockPdfGetText }))
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

    const processor = createProcessor()

    const result = await processor.search("What is policy?")

    expect(result).toEqual([
      {
        source: "policy.md",
        chunkText: "4-day policy",
      },
    ])
  })

  it("stores contentSummary when upload ingestion succeeds", async () => {
    mockIngestGeminiFile.mockResolvedValue({ fileId: "gemini-file-123" })
    mockPdfGetText.mockResolvedValue({
      text: "This policy describes paid time off and remote work eligibility",
    })
    mockGenerateText.mockResolvedValue({
      text: "Policy describing paid time off and remote work eligibility.",
    })

    const processor = createProcessor()
    const file = createFile("kb_file_1")

    await processor.ingestKnowledgeBaseFile(file, Buffer.from("pdf data"))

    expect(mockIngestGeminiFile).toHaveBeenCalledWith({
      vectorStoreId: "store_1",
      filename: "policy.pdf",
      mimetype: "application/pdf",
      buffer: expect.any(Buffer),
    })
    expect(mockGetDefaultLLMOrThrow).toHaveBeenCalledWith({
      reasoningEffort: "low",
    })
    expect(mockGenerateText).toHaveBeenCalled()
    expect(file.status).toBe(KnowledgeBaseFileStatus.READY)
    expect(file.ragSourceId).toBe("gemini-file-123")
    expect(file.contentSummary).toBe(
      "Policy describing paid time off and remote work eligibility."
    )
    expect(mockUpdateKnowledgeBaseFile).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "kb_file_1",
        status: "ready",
        contentSummary:
          "Policy describing paid time off and remote work eligibility.",
      })
    )
  })

  it("does not fail ingestion if content summary generation fails", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {})
    mockIngestGeminiFile.mockResolvedValue({ fileId: "gemini-file-123" })
    mockGetDefaultLLMOrThrow.mockRejectedValue(new Error("No model"))

    const processor = createProcessor()
    const file = createFile("kb_file_2")

    await expect(
      processor.ingestKnowledgeBaseFile(file, Buffer.from("pdf data"))
    ).resolves.toBeUndefined()

    expect(file.status).toBe(KnowledgeBaseFileStatus.READY)
    expect(file.contentSummary).toBeUndefined()
    expect(mockUpdateKnowledgeBaseFile).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "kb_file_2",
        status: "ready",
        contentSummary: undefined,
      })
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to generate knowledge file summary",
      expect.objectContaining({
        fileId: "kb_file_2",
        filename: "policy.pdf",
      })
    )
    consoleSpy.mockRestore()
  })
})
