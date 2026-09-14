import { events } from "@budibase/backend-core"
import {
  KnowledgeBaseFileStatus,
  KnowledgeBaseType,
  type AzureKnowledgeBase,
  type KnowledgeBase,
  type KnowledgeBaseFile,
  type WithRequired,
} from "@budibase/types"
import type { RagProcessor } from "."
import { updateKnowledgeBaseFile } from "../../knowledgeBase/files"
import {
  deleteAzureFileFromStore,
  ingestAzureFile,
  searchAzureFileStore,
} from "../../knowledgeBase/azureFileStore"
import { prepareTabularKnowledgeFileForRagIngestion } from "./tabularText"

export class AzureRagProcessor implements RagProcessor {
  private knowledgeBase: WithRequired<AzureKnowledgeBase, "_id">

  constructor(knowledgeBase: WithRequired<KnowledgeBase, "_id">) {
    if (knowledgeBase.type !== KnowledgeBaseType.AZURE) {
      throw new Error(
        `AzureRagProcessor is not compatible with ${knowledgeBase.type}`
      )
    }
    this.knowledgeBase = knowledgeBase
  }

  async ingestKnowledgeBaseFile(
    input: WithRequired<KnowledgeBaseFile, "_id">,
    fileBuffer: Buffer
  ): Promise<void> {
    const file = prepareTabularKnowledgeFileForRagIngestion({
      filename: input.filename,
      mimetype: input.mimetype,
      buffer: fileBuffer,
    })
    const { fileId } = await ingestAzureFile({
      vectorStoreId: this.knowledgeBase.config.vectorStoreId,
      ...file,
    })
    try {
      await updateKnowledgeBaseFile({
        ...input,
        status: KnowledgeBaseFileStatus.READY,
        ragSourceId: fileId,
        processedAt: new Date().toISOString(),
        errorMessage: undefined,
      })
    } catch (error) {
      await this.deleteFiles([fileId]).catch(() => {
        console.log(
          "Failed to clean up Azure file after saving ingestion result failed",
          { fileId }
        )
      })
      throw error
    }
    events.ai.ragFileProcessed({
      knowledgeBaseId: this.knowledgeBase._id,
      fileId: input._id,
      sourceType: input.source?.type,
      processor: this.knowledgeBase.type,
    })
  }

  async search(question: string) {
    return await searchAzureFileStore({
      vectorStoreId: this.knowledgeBase.config.vectorStoreId,
      query: question,
    })
  }

  async deleteFiles(fileIds: string[]): Promise<void> {
    for (const fileId of fileIds.filter(Boolean)) {
      await deleteAzureFileFromStore({
        vectorStoreId: this.knowledgeBase.config.vectorStoreId,
        fileId,
      })
    }
  }
}
