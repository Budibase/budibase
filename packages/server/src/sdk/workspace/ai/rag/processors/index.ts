import { KnowledgeBaseFile, WithRequired } from "@budibase/types"

export interface RetrievedContextChunk {
  source?: string
  chunkText: string
}

export interface RagSearchResult {
  chunks: RetrievedContextChunk[]
  answer?: string
}

export interface RagProcessor {
  ingestKnowledgeBaseFile(
    input: WithRequired<KnowledgeBaseFile, "_id">,
    fileBuffer: Buffer
  ): Promise<void>

  search(question: string): Promise<RagSearchResult>
  deleteFiles(fileIds: string[]): Promise<void>
}
