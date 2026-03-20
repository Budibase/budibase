import type {
  Agent,
  AgentMessageRagSource,
  KnowledgeBase,
} from "@budibase/types"

export interface RetrievedContextChunk {
  sourceId: string
  chunkText: string
  chunkHash: string
}

export interface RetrievedContextResult {
  text: string
  chunks: RetrievedContextChunk[]
  sources: AgentMessageRagSource[]
}

export interface RetrievalProvider {
  retrieveContextForAgent(
    agent: Agent,
    question: string,
    knowledgeBases?: KnowledgeBase[]
  ): Promise<RetrievedContextResult>
}
