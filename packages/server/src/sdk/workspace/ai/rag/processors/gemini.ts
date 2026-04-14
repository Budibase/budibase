import {
  GeminiKnowledgeBase,
  KnowledgeBase,
  KnowledgeBaseFile,
  KnowledgeBaseFileStatus,
  KnowledgeBaseType,
} from "@budibase/types"
import { generateText } from "ai"
import { PDFParse } from "pdf-parse"
import { RagProcessor, RetrievedContextChunk } from "."
import {
  deleteGeminiFileFromStore,
  ingestGeminiFile,
  searchGeminiFileStore,
} from "../../knowledgeBase/geminiFileStore"
import { getDefaultLLMOrThrow } from "../../llm"
import { updateKnowledgeBaseFile } from "../../knowledgeBase"

const TEXT_SUMMARY_INPUT_LIMIT = 12000
const CONTENT_SUMMARY_LIMIT = 220
const textExtensions = new Set([
  ".txt",
  ".md",
  ".markdown",
  ".json",
  ".yaml",
  ".yml",
  ".csv",
  ".tsv",
  ".xml",
  ".html",
  ".htm",
  ".rtf",
])

const getFilenameExtension = (filename?: string) => {
  if (!filename) {
    return ""
  }

  const index = filename.lastIndexOf(".")
  if (index < 0) {
    return ""
  }

  return filename.slice(index).toLowerCase()
}

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim()

const truncateWithEllipsis = (value: string, limit: number) => {
  if (value.length <= limit) {
    return value
  }

  return `${value.slice(0, limit - 3).trimEnd()}...`
}

const supportsTextExtraction = (
  input: Pick<KnowledgeBaseFile, "filename" | "mimetype">
) => {
  if (input.mimetype?.toLowerCase().startsWith("text/")) {
    return true
  }

  const extension = getFilenameExtension(input.filename)
  return textExtensions.has(extension)
}

const isPdfFile = (input: Pick<KnowledgeBaseFile, "filename" | "mimetype">) => {
  if (input.mimetype?.toLowerCase().includes("pdf")) {
    return true
  }
  return getFilenameExtension(input.filename) === ".pdf"
}

const extractTextForSummary = async (
  input: Pick<KnowledgeBaseFile, "filename" | "mimetype">,
  fileBuffer: Buffer
) => {
  if (isPdfFile(input)) {
    const parser = new PDFParse({ data: new Uint8Array(fileBuffer) })
    const parsed = await parser.getText()
    const normalized = normalizeWhitespace(parsed.text || "")
    return normalized || undefined
  }

  if (!supportsTextExtraction(input)) {
    return undefined
  }

  const normalized = normalizeWhitespace(fileBuffer.toString("utf8"))
  return normalized || undefined
}

const generateContentSummary = async (
  input: Pick<KnowledgeBaseFile, "filename" | "mimetype">,
  fileBuffer: Buffer
) => {
  const extractedText = await extractTextForSummary(input, fileBuffer)
  if (!extractedText) {
    return undefined
  }

  const llm = await getDefaultLLMOrThrow({ reasoningEffort: "low" })
  const summaryInput = truncateWithEllipsis(
    extractedText,
    TEXT_SUMMARY_INPUT_LIMIT
  )
  const result = await generateText({
    model: llm.chat,
    providerOptions: llm.providerOptions?.(false),
    messages: [
      {
        role: "system",
        content:
          "You summarize uploaded documents for metadata. Return exactly one plain sentence (no bullets, no markdown, no labels) describing what the document is about.",
      },
      {
        role: "user",
        content: [
          `Filename: ${input.filename || "unknown"}`,
          input.mimetype ? `MIME type: ${input.mimetype}` : undefined,
          "Document text excerpt:",
          summaryInput,
        ]
          .filter(Boolean)
          .join("\n\n"),
      },
    ],
  })

  const summary = normalizeWhitespace(result.text || "")
  if (!summary) {
    return undefined
  }

  return truncateWithEllipsis(summary, CONTENT_SUMMARY_LIMIT)
}

export class GeminiRagProcessor implements RagProcessor {
  private knowledgeBase: GeminiKnowledgeBase

  constructor(knowledgeBase: KnowledgeBase) {
    if (knowledgeBase.type !== KnowledgeBaseType.GEMINI) {
      throw new Error(
        `GeminiRagProcessor is not compatible with knowledge base type ${knowledgeBase.type}`
      )
    }

    this.knowledgeBase = knowledgeBase
  }

  async ingestKnowledgeBaseFile(
    input: KnowledgeBaseFile,
    fileBuffer: Buffer
  ): Promise<void> {
    const ingested = await ingestGeminiFile({
      vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
      filename: input.filename,
      mimetype: input.mimetype,
      buffer: fileBuffer,
    })

    input.status = KnowledgeBaseFileStatus.READY
    input.ragSourceId = ingested.fileId || input.ragSourceId
    input.processedAt = new Date().toISOString()
    input.errorMessage = undefined

    try {
      input.contentSummary = await generateContentSummary(input, fileBuffer)
    } catch (error) {
      console.log("Failed to generate knowledge file summary", {
        fileId: input._id,
        filename: input.filename,
        error,
      })
      input.contentSummary = undefined
    }

    await updateKnowledgeBaseFile(input)
  }

  async search(question: string): Promise<RetrievedContextChunk[]> {
    const rows = await searchGeminiFileStore({
      vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
      query: question,
    })

    const results = rows.map<RetrievedContextChunk>(row => {
      const chunkText = row.content
        ?.map(x => x.text)
        .join("\n")
        .trim()
      return {
        source: row.filename ?? undefined,
        chunkText,
      }
    })

    return results
  }

  async deleteFiles(fileIds: string[]): Promise<void> {
    const filteredIds = fileIds.filter(Boolean)
    await Promise.all(
      filteredIds.map(fileId =>
        deleteGeminiFileFromStore({
          vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
          fileId,
        })
      )
    )
  }
}
