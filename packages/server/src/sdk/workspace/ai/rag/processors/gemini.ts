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
import {
  getKnowledgeBaseFileOrThrow,
  updateKnowledgeBaseFile,
} from "../../knowledgeBase"
import { generatePdfPreviews, isPdfFile } from "../../knowledgeBase/pdfPreviews"

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
      const ingested = await ingestGeminiFile({
        vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
        filename: input.filename,
        mimetype: input.mimetype,
        buffer: fileBuffer,
      })

      input.status = KnowledgeBaseFileStatus.READY
      input.ragSourceId = ingested.fileId
      input.processedAt = new Date().toISOString()
      input.errorMessage = undefined
      const updatedFile = await updateKnowledgeBaseFile(input)

      if (
        updatedFile._id &&
        isPdfFile({
          filename: updatedFile.filename,
          mimetype: updatedFile.mimetype,
        })
      ) {
        void this.generateAndPersistPreviews(updatedFile, fileBuffer)
      }

      console.log("Completed Gemini RAG file ingestion", {
        knowledgeBaseId,
        vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
        fileId: input._id,
        ragSourceId: input.ragSourceId,
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

  private async generateAndPersistPreviews(
    file: KnowledgeBaseFile,
    fileBuffer: Buffer
  ) {
    const knowledgeBaseId = this.knowledgeBase._id
    if (!file._id || !knowledgeBaseId) {
      return
    }

    try {
      const previews = await generatePdfPreviews({
        knowledgeBaseId,
        fileId: file._id,
        filename: file.filename,
        buffer: fileBuffer,
      })
      if (previews.length === 0) {
        return
      }

      const latestFile = await getKnowledgeBaseFileOrThrow(file._id)
      await updateKnowledgeBaseFile({
        ...latestFile,
        previews,
      })
      console.log("Stored PDF preview metadata", {
        knowledgeBaseId,
        fileId: file._id,
        previewCount: previews.length,
      })
    } catch (error) {
      console.error("Failed to persist PDF preview metadata", {
        knowledgeBaseId,
        fileId: file._id,
        error,
      })
    }
  }

  async search(question: string): Promise<RetrievedContextChunk[]> {
    const rows = await searchGeminiFileStore({
      vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
      query: question,
    })

    const results = rows.map<RetrievedContextChunk>(row => {
      const chunkText = row.content
        ?.filter(content => content.type === "text" && content.text)
        .map(content => content.text)
        .join("\n")
        .trim()
      const imagePreviewContent = row.content?.find(content =>
        Boolean(content.image_url)
      )
      const previewUrl = row.image_url || imagePreviewContent?.image_url
      const previewPage = row.page || imagePreviewContent?.page

      return {
        source: row.file_id || row.filename || undefined,
        chunkText,
        ...(previewUrl ? { previewUrl } : {}),
        ...(previewPage ? { previewPage } : {}),
        ...(row.score ? { previewScore: row.score } : {}),
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
