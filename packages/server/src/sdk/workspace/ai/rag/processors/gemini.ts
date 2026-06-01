import {
  GeminiKnowledgeBase,
  KnowledgeBase,
  KnowledgeBaseFile,
  KnowledgeBaseFileStatus,
  KnowledgeBaseType,
} from "@budibase/types"
import { RagProcessor, RetrievedContextChunk } from "."
import {
  deleteGeminiFileFromStore,
  ingestGeminiFile,
  searchGeminiFileStore,
} from "../../knowledgeBase/geminiFileStore"
import { updateKnowledgeBaseFile } from "../../knowledgeBase"
import { buildSpreadsheetIngestVariants } from "./spreadsheetTransforms"

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
    const startedAtMs = Date.now()
    const knowledgeBaseId = this.knowledgeBase._id
    console.log("Starting Gemini RAG file ingestion", {
      knowledgeBaseId,
      vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
      fileId: input._id,
      filename: input.filename,
      mimetype: input.mimetype,
      fileSize: fileBuffer.byteLength,
    })

    try {
      const variants = buildSpreadsheetIngestVariants({
        filename: input.filename,
        mimetype: input.mimetype,
        buffer: fileBuffer,
      })
      const ingestedFileIds: string[] = []

      try {
        for (const variant of variants) {
          const ingested = await ingestGeminiFile({
            vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
            filename: variant.filename,
            mimetype: variant.mimetype,
            buffer: variant.buffer,
          })
          ingestedFileIds.push(ingested.fileId)
          console.log("Completed Gemini RAG file variant ingestion", {
            knowledgeBaseId,
            vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
            fileId: input._id,
            filename: input.filename,
            strategy: variant.strategy,
            ragSourceId: ingested.fileId,
          })
        }
      } catch (error) {
        await Promise.allSettled(
          ingestedFileIds.map(fileId =>
            deleteGeminiFileFromStore({
              vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
              fileId,
            })
          )
        )
        throw error
      }

      input.status = KnowledgeBaseFileStatus.READY
      input.ragSourceId = ingestedFileIds[0]
      input.ragSourceIds = ingestedFileIds
      input.processedAt = new Date().toISOString()
      input.errorMessage = undefined
      await updateKnowledgeBaseFile(input)
      console.log("Completed Gemini RAG file ingestion", {
        knowledgeBaseId,
        vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
        fileId: input._id,
        ragSourceId: input.ragSourceId,
        ragSourceIds: input.ragSourceIds,
        durationMs: Date.now() - startedAtMs,
      })
    } catch (error) {
      console.error("Failed Gemini RAG file ingestion", {
        knowledgeBaseId,
        vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
        fileId: input._id,
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

    const results = rows.map<RetrievedContextChunk>(row => {
      const chunkText = row.content
        ?.map(x => x.text)
        .join("\n")
        .trim()
      return {
        source: row.file_id || row.filename || undefined,
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
