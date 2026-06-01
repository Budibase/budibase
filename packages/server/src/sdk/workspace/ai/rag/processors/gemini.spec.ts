const mockSearchGeminiFileStore = jest.fn()
const mockIngestGeminiFile = jest.fn()
const mockDeleteGeminiFileFromStore = jest.fn()
const mockUpdateKnowledgeBaseFile = jest.fn()
const mockBuildSpreadsheetIngestVariants = jest.fn()

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

jest.mock("./spreadsheetTransforms", () => ({
  buildSpreadsheetIngestVariants: (...args: any[]) =>
    mockBuildSpreadsheetIngestVariants(...args),
}))

import { KnowledgeBaseFileStatus, KnowledgeBaseType } from "@budibase/types"
import { GeminiRagProcessor } from "./gemini"

describe("GeminiRagProcessor", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockBuildSpreadsheetIngestVariants.mockImplementation(
      ({ filename, mimetype, buffer }) => [
        {
          strategy: "native",
          filename,
          mimetype,
          buffer,
        },
      ]
    )
  })

  it("ingests spreadsheet row batches and stores all source ids", async () => {
    mockBuildSpreadsheetIngestVariants.mockReturnValue([
      {
        strategy: "native",
        filename: "sheet.xlsx",
        mimetype:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        buffer: Buffer.from("native"),
      },
      {
        strategy: "row_batch",
        filename: "sheet.xlsx",
        mimetype: "text/plain",
        buffer: Buffer.from("rows 1-100"),
      },
      {
        strategy: "row_batch",
        filename: "sheet.xlsx",
        mimetype: "text/plain",
        buffer: Buffer.from("rows 101-200"),
      },
    ])
    mockIngestGeminiFile
      .mockResolvedValueOnce({ fileId: "native-source" })
      .mockResolvedValueOnce({ fileId: "row-source" })
      .mockResolvedValueOnce({ fileId: "row-source-2" })

    const processor = new GeminiRagProcessor({
      _id: "kb_1",
      name: "KB",
      type: KnowledgeBaseType.GEMINI,
      config: {
        googleFileStoreId: "store_1",
      },
    } as any)

    const file = {
      _id: "file_1",
      knowledgeBaseId: "kb_1",
      filename: "sheet.xlsx",
      mimetype:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      objectStoreKey: "obj",
      ragSourceId: "file_1",
      ragSourceIds: ["file_1"],
      status: KnowledgeBaseFileStatus.PROCESSING,
      uploadedBy: "user_1",
    }

    await processor.ingestKnowledgeBaseFile(file as any, Buffer.from("binary"))

    expect(mockIngestGeminiFile).toHaveBeenCalledTimes(3)
    expect(mockUpdateKnowledgeBaseFile).toHaveBeenCalledWith(
      expect.objectContaining({
        status: KnowledgeBaseFileStatus.READY,
        ragSourceId: "native-source",
        ragSourceIds: ["native-source", "row-source", "row-source-2"],
      })
    )
  })

  it("cleans up already ingested variants when a later variant fails", async () => {
    mockBuildSpreadsheetIngestVariants.mockReturnValue([
      {
        strategy: "native",
        filename: "sheet.xlsx",
        mimetype:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        buffer: Buffer.from("native"),
      },
      {
        strategy: "row_batch",
        filename: "sheet.xlsx",
        mimetype: "text/plain",
        buffer: Buffer.from("row text"),
      },
    ])
    mockIngestGeminiFile
      .mockResolvedValueOnce({ fileId: "native-source" })
      .mockRejectedValueOnce(new Error("ingest failed"))

    const processor = new GeminiRagProcessor({
      _id: "kb_1",
      name: "KB",
      type: KnowledgeBaseType.GEMINI,
      config: {
        googleFileStoreId: "store_1",
      },
    } as any)

    const file = {
      _id: "file_1",
      knowledgeBaseId: "kb_1",
      filename: "sheet.xlsx",
      mimetype:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      objectStoreKey: "obj",
      ragSourceId: "file_1",
      ragSourceIds: ["file_1"],
      status: KnowledgeBaseFileStatus.PROCESSING,
      uploadedBy: "user_1",
    }

    await expect(
      processor.ingestKnowledgeBaseFile(file as any, Buffer.from("binary"))
    ).rejects.toThrow("ingest failed")

    expect(mockDeleteGeminiFileFromStore).toHaveBeenCalledWith({
      vectorStoreId: "store_1",
      fileId: "native-source",
    })
    expect(mockUpdateKnowledgeBaseFile).not.toHaveBeenCalled()
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
})
