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
    await updateKnowledgeBaseFile(input)
  }

  async search(
    question: string,
    sourceIds?: string[]
  ): Promise<RetrievedContextChunk[]> {
    const rows = await searchGeminiFileStore({
      vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
      query: question,
      fileIds: sourceIds,
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
