import type { Agent, KnowledgeBase } from "@budibase/types"
import type { RetrievalProvider, RetrievedContextResult } from "../types"
import { retrieveContextForAgent as retrieveContextFromRag } from "../../rag/files"

export class BudibaseVectorRetrievalProvider implements RetrievalProvider {
  async retrieveContextForAgent(
    agent: Agent,
    question: string,
    _knowledgeBases?: KnowledgeBase[]
  ): Promise<RetrievedContextResult> {
    return await retrieveContextFromRag(agent, question)
  }
}
