import {
  GeminiKnowledgeBase,
  KnowledgeBase,
  KnowledgeBaseFile,
  KnowledgeBaseFileStatus,
  KnowledgeBaseType,
  WithRequired,
} from "@budibase/types"
import { events } from "@budibase/backend-core"
import { RagProcessor, RetrievedContextChunk } from "."
import {
  deleteGeminiFileFromStore,
  ingestGeminiFile,
  searchGeminiFileStore,
} from "../../knowledgeBase/geminiFileStore"
import { updateKnowledgeBaseFile } from "../../knowledgeBase"
import { prepareTabularKnowledgeFileForRagIngestion } from "./tabularText"

export class GeminiRagProcessor implements RagProcessor {
  private knowledgeBase: WithRequired<GeminiKnowledgeBase, "_id">

  constructor(knowledgeBase: WithRequired<KnowledgeBase, "_id">) {
    if (knowledgeBase.type !== KnowledgeBaseType.GEMINI) {
      throw new Error(
        `GeminiRagProcessor is not compatible with knowledge base type ${knowledgeBase.type}`
      )
    }

    this.knowledgeBase = knowledgeBase
  }

  async ingestKnowledgeBaseFile(
    input: WithRequired<KnowledgeBaseFile, "_id">,
    fileBuffer: Buffer
  ): Promise<void> {
    const startedAtMs = Date.now()
    const knowledgeBaseId = this.knowledgeBase._id
    const fileId = input._id
    console.log("Starting Gemini RAG file ingestion", {
      knowledgeBaseId,
      vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
      fileId,
      filename: input.filename,
      mimetype: input.mimetype,
      fileSize: fileBuffer.byteLength,
    })

    try {
      const fileForIngestion = prepareTabularKnowledgeFileForRagIngestion({
        filename: input.filename,
        mimetype: input.mimetype,
        buffer: fileBuffer,
      })

      const ingested = await ingestGeminiFile({
        vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
        filename: fileForIngestion.filename,
        mimetype: fileForIngestion.mimetype,
        buffer: fileForIngestion.buffer,
      })

      input.status = KnowledgeBaseFileStatus.READY
      input.ragSourceId = ingested.fileId
      input.processedAt = new Date().toISOString()
      input.errorMessage = undefined
      await updateKnowledgeBaseFile(input)
      console.log("Completed Gemini RAG file ingestion", {
        knowledgeBaseId,
        vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
        fileId,
        ragSourceId: input.ragSourceId,
        durationMs: Date.now() - startedAtMs,
      })

      events.ai.ragFileProcessed({
        knowledgeBaseId,
        fileId,
        sourceType: input.source?.type,
        processor: this.knowledgeBase.type,
      })
    } catch (error) {
      console.error("Failed Gemini RAG file ingestion", {
        knowledgeBaseId,
        vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
        fileId,
        filename: input.filename,
        durationMs: Date.now() - startedAtMs,
        error,
      })
      throw error
    }
  }

  async search(question: string): Promise<RetrievedContextChunk[]> {
    const rows = await searchGeminiFileStore({
      vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
      query: question,
    })

    const results = rows.map<RetrievedContextChunk>(row => ({
      source: getChunkSource(row),
      chunkText: getChunkText(row),
    }))

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

const asRecord = (value: unknown): Record<string, unknown> | undefined => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined
  }
  return value as Record<string, unknown>
}

const getRetrievedContext = (
  value: Record<string, unknown>
): Record<string, unknown> | undefined => {
  return asRecord(value.retrievedContext) || asRecord(value.retrieved_context)
}

const getStringValue = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed || undefined
}

const getChunkSource = (row: Record<string, unknown>): string | undefined => {
  const retrievedContext = getRetrievedContext(row)
  const content = row.content
  const contentRetrievedContexts = Array.isArray(content)
    ? content
        .map(part => asRecord(part))
        .map(partRecord =>
          partRecord ? getRetrievedContext(partRecord) : undefined
        )
    : []

  const sourceCandidates = [
    row.file_id,
    row.filename,
    ...contentRetrievedContexts.flatMap(context => [
      context?.mediaId,
      context?.media_id,
      context?.title,
      context?.uri,
    ]),
    retrievedContext?.mediaId,
    retrievedContext?.media_id,
    row.id,
    retrievedContext?.title,
    retrievedContext?.uri,
  ]

  for (const candidate of sourceCandidates) {
    const value = getStringValue(candidate)
    if (value) {
      return value
    }
  }

  return undefined
}

const getChunkTextFromPart = (part: unknown): string | undefined => {
  const directText = getStringValue(part)
  if (directText) {
    return directText
  }

  const record = asRecord(part)
  if (!record) {
    return undefined
  }

  return (
    getStringValue(record.text) ||
    getStringValue(getRetrievedContext(record)?.text)
  )
}

const getChunkText = (row: Record<string, unknown>): string => {
  const content = row.content
  if (Array.isArray(content)) {
    const contentText = content
      .map(getChunkTextFromPart)
      .filter((text): text is string => Boolean(text))
      .join("\n")
      .trim()

    return contentText || getStringValue(getRetrievedContext(row)?.text) || ""
  }

  return (
    getStringValue(content) ||
    getStringValue(getRetrievedContext(row)?.text) ||
    ""
  )
}
