const mockGenerateGeminiFileStoreAnswer = jest.fn()
const mockIngestGeminiFile = jest.fn()
const mockDeleteGeminiFileFromStore = jest.fn()
const mockUpdateKnowledgeBaseFile = jest.fn()

jest.mock("../../knowledgeBase/geminiFileStore", () => ({
  generateGeminiFileStoreAnswer: (...args: any[]) =>
    mockGenerateGeminiFileStoreAnswer(...args),
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
  config: { googleFileStoreId: "store_1" },
} satisfies KnowledgeBase

describe("GeminiRagProcessor", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns the Gemini answer when File Search ran without grounding metadata", async () => {
    mockGenerateGeminiFileStoreAnswer.mockResolvedValue({
      candidates: [
        {
          content: {
            parts: [
              { text: "The Cooldown period starts in " },
              { text: "November 2026." },
            ],
          },
        },
      ],
      usageMetadata: { toolUsePromptTokenCount: 1851 },
    })

    const result = await new GeminiRagProcessor(knowledgeBase).search(
      "When does the Cooldown period start?"
    )

    expect(result).toEqual({
      answer: "The Cooldown period starts in November 2026.",
      chunks: [],
    })
  })

  it("returns grounded passages without inventing a source for a generated filename", async () => {
    mockGenerateGeminiFileStoreAnswer.mockResolvedValue({
      candidates: [
        {
          content: { parts: [{ text: "The period starts in November." }] },
          groundingMetadata: {
            groundingChunks: [
              {
                retrievedContext: {
                  title: "3e1d7203e1314528b9813e00f6c8114b.txt",
                  text: "November: agree priorities.",
                },
              },
            ],
          },
        },
      ],
    })

    const result = await new GeminiRagProcessor(knowledgeBase).search(
      "When does the period start?"
    )

    expect(result).toEqual({
      answer: "The period starts in November.",
      chunks: [{ source: undefined, chunkText: "November: agree priorities." }],
    })
  })

  it("does not use an unsupported answer when File Search was not used", async () => {
    mockGenerateGeminiFileStoreAnswer.mockResolvedValue({
      candidates: [{ content: { parts: [{ text: "An ungrounded answer" }] } }],
      usageMetadata: { toolUsePromptTokenCount: 0 },
    })

    const result = await new GeminiRagProcessor(knowledgeBase).search(
      "What is the policy?"
    )

    expect(result).toEqual({ chunks: [], answer: undefined })
  })

  it("normalizes spreadsheet uploads into plain text before ingestion", async () => {
    mockIngestGeminiFile.mockResolvedValue({ fileId: "gemini-file-1" })
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([
        ["Plan", "Price"],
        ["Pro", 49],
      ]),
      "Plans"
    )
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

    await new GeminiRagProcessor(knowledgeBase).ingestKnowledgeBaseFile(
      file,
      XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
    )

    const ingestPayload = mockIngestGeminiFile.mock.calls[0][0]
    expect(ingestPayload.vectorStoreId).toBe("store_1")
    expect(ingestPayload.mimetype).toBe("text/plain")
    expect(ingestPayload.buffer.toString("utf8")).toContain("Plan: Pro")
    expect(mockUpdateKnowledgeBaseFile).toHaveBeenCalledWith(
      expect.objectContaining({
        status: KnowledgeBaseFileStatus.READY,
        ragSourceId: "gemini-file-1",
      })
    )
  })
})
