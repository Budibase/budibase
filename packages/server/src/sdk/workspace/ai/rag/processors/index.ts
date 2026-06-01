import { KnowledgeBaseFile, WithRequired } from "@budibase/types"

export interface RetrievedContextChunk {
  source?: string
  chunkText: string
}

export interface RagProcessor {
  ingestKnowledgeBaseFile(
    input: WithRequired<KnowledgeBaseFile, "_id">,
    fileBuffer: Buffer
  ): Promise<void>

  search(question: string): Promise<RetrievedContextChunk[]>
  deleteFiles(fileIds: string[]): Promise<void>
}
