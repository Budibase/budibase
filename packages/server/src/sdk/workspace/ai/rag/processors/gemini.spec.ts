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

import {
  KnowledgeBaseFileStatus,
  KnowledgeBaseType,
  type KnowledgeBase,
  type KnowledgeBaseFile,
  type WithRequired,
} from "@budibase/types"
import * as XLSX from "xlsx"
import { GeminiRagProcessor } from "./gemini"

const knowledgeBase = {
  _id: "kb_1",
  name: "KB",
  type: KnowledgeBaseType.GEMINI,
  config: {
    googleFileStoreId: "store_1",
  },
} satisfies KnowledgeBase

const buildWorkbookBuffer = (
  rows: Array<Array<string | number>>,
  sheetName = "Plans"
) => {
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet(rows),
    sheetName
  )
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
}

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

  it("falls back to row-level retrievedContext text when content parts have no text", async () => {
    mockSearchGeminiFileStore.mockResolvedValue([
      {
        id: "row-1",
        filename: "policy.md",
        score: 0.9,
        retrievedContext: {
          text: "Policies are reviewed quarterly.",
        },
        content: [
          {
            type: "metadata",
          },
        ],
      },
    ])

    const result = await createProcessor().search(
      "How often are policies reviewed?"
    )

    expect(result).toEqual([
      {
        source: "policy.md",
        chunkText: "Policies are reviewed quarterly.",
      },
    ])
  })

  it("normalizes spreadsheet uploads into plain text before ingestion", async () => {
    mockIngestGeminiFile.mockResolvedValue({ fileId: "gemini-file-1" })

    const processor = new GeminiRagProcessor(knowledgeBase)

    const file = {
      _id: "file_1",
      knowledgeBaseId: "kb_1",
      filename: "pricing.xlsx",
      mimetype:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      objectStoreKey: "uploads/pricing.xlsx",
      ragSourceId: "",
      status: KnowledgeBaseFileStatus.PROCESSING,
      uploadedBy: "user_1",
    } satisfies WithRequired<KnowledgeBaseFile, "_id">

    await processor.ingestKnowledgeBaseFile(
      file,
      buildWorkbookBuffer([
        ["Plan", "Price"],
        ["Pro", 49],
      ])
    )

    expect(mockIngestGeminiFile).toHaveBeenCalledTimes(1)
    const ingestPayload = mockIngestGeminiFile.mock.calls[0][0]
    expect(ingestPayload.vectorStoreId).toBe("store_1")
    expect(ingestPayload.filename).toBe("pricing.xlsx")
    expect(ingestPayload.mimetype).toBe("text/plain")
    expect(ingestPayload.buffer.toString("utf8")).toContain(
      "Columns: Plan | Price"
    )
    expect(ingestPayload.buffer.toString("utf8")).toContain("Plan: Pro")
    expect(ingestPayload.buffer.toString("utf8")).toContain("Price: 49")
    expect(mockUpdateKnowledgeBaseFile).toHaveBeenCalledWith(
      expect.objectContaining({
        status: KnowledgeBaseFileStatus.READY,
        ragSourceId: "gemini-file-1",
      })
    )
  })
})
