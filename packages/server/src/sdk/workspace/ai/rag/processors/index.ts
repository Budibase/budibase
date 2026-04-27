import { KnowledgeBaseFile } from "@budibase/types"

export interface RetrievedContextChunk {
  source?: string
  chunkText: string
}

export interface RagProcessor {
  ingestKnowledgeBaseFile(
    input: KnowledgeBaseFile,
    fileBuffer: Buffer
  ): Promise<void>

  search(
    question: string,
    sourceIds?: string[]
  ): Promise<RetrievedContextChunk[]>
  deleteFiles(fileIds: string[]): Promise<void>
}
