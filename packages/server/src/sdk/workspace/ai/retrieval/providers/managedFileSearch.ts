import type { Agent, KnowledgeBase } from "@budibase/types"
import type { RetrievalProvider, RetrievedContextResult } from "../types"

export class ManagedFileSearchRetrievalProvider implements RetrievalProvider {
  async retrieveContextForAgent(
    _agent: Agent,
    _question: string,
    _knowledgeBases?: KnowledgeBase[]
  ): Promise<RetrievedContextResult> {
    // Placeholder provider for managed retrieval backends.
    return {
      text: "",
      chunks: [],
      sources: [],
    }
  }
}
