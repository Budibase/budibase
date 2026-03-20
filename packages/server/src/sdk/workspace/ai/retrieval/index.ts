import type { Agent, KnowledgeBase } from "@budibase/types"
import { knowledgeBase } from ".."
import { BudibaseVectorRetrievalProvider } from "./providers/budibaseVector"
import { ManagedFileSearchRetrievalProvider } from "./providers/managedFileSearch"
import type { RetrievalProvider } from "./types"

const MANAGED_FILE_SEARCH_BACKEND = "managed_file_search"

const getRetrievalBackend = (config: KnowledgeBase | undefined) => {
  if (!config) {
    return undefined
  }

  return Reflect.get(config, "retrievalBackend")
}

export const createRetrievalProviderForAgent = async (
  agent: Agent
): Promise<RetrievalProvider> => {
  const knowledgeBaseIds = (agent.knowledgeBases || []).filter(Boolean)
  if (knowledgeBaseIds.length === 0) {
    return new BudibaseVectorRetrievalProvider()
  }

  const knowledgeBases = await Promise.all(
    knowledgeBaseIds.map(
      async knowledgeBaseId => await knowledgeBase.find(knowledgeBaseId)
    )
  )

  const hasManagedFileSearchKnowledgeBase = knowledgeBases.some(
    kb => getRetrievalBackend(kb) === MANAGED_FILE_SEARCH_BACKEND
  )

  if (hasManagedFileSearchKnowledgeBase) {
    return new ManagedFileSearchRetrievalProvider()
  }

  return new BudibaseVectorRetrievalProvider()
}

export * from "./types"
