import {
  GeminiKnowledgeBase,
  KnowledgeBase,
  KnowledgeBaseFile,
  KnowledgeBaseFileStatus,
  KnowledgeBaseType,
  WithRequired,
} from "@budibase/types"
import { events } from "@budibase/backend-core"
import { RagProcessor, RagSearchResult } from "."
import {
  deleteGeminiFileFromStore,
  ingestGeminiFile,
  generateGeminiFileStoreAnswer,
} from "../../knowledgeBase/geminiFileStore"
import { updateKnowledgeBaseFile } from "../../knowledgeBase"
import { prepareTabularKnowledgeFileForRagIngestion } from "./tabularText"
import { GeminiRateLimitError } from "../geminiRateLimit"

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
      if (error instanceof GeminiRateLimitError) {
        throw error
      }
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

  async search(question: string): Promise<RagSearchResult> {
    const response = await generateGeminiFileStoreAnswer({
      vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
      query: question,
    })

    const chunks = (response.candidates || []).flatMap(candidate =>
      (candidate.groundingMetadata?.groundingChunks || []).flatMap(chunk => {
        const text = chunk.retrievedContext?.text?.trim()
        if (!text) {
          return []
        }
        return [
          {
            source: chunk.retrievedContext?.uri || undefined,
            chunkText: text,
            preserveIfSourceUnmatched: true,
          },
        ]
      })
    )
    const answer = (response.candidates || [])
      .flatMap(candidate => candidate.content?.parts || [])
      .map(part => part.text || "")
      .join("")
      .trim()

    return {
      chunks,
      answer:
        answer &&
        (chunks.length > 0 || response.usageMetadata?.toolUsePromptTokenCount)
          ? answer
          : undefined,
    }
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
