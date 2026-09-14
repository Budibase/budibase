import { HTTPError } from "@budibase/backend-core"
import { KnowledgeBaseType, type KnowledgeBase } from "@budibase/types"
import environment from "../../../../environment"
import {
  createAzureFileStore,
  deleteAzureVectorStore,
  isAzureFileSearchConfigured,
} from "./azureFileStore"
import {
  createGeminiFileStore,
  deleteGeminiVectorStore,
  isGeminiFileSearchConfigured,
} from "./geminiFileStore"

export const getKnowledgeBaseProvider = (): KnowledgeBaseType => {
  const provider =
    environment.KNOWLEDGE_BASE_PROVIDER || KnowledgeBaseType.GEMINI
  if (
    provider !== KnowledgeBaseType.GEMINI &&
    provider !== KnowledgeBaseType.AZURE
  ) {
    throw new HTTPError("KNOWLEDGE_BASE_PROVIDER must be gemini or azure", 400)
  }
  return provider
}

export const isKnowledgeSearchConfigured = () =>
  getKnowledgeBaseProvider() === KnowledgeBaseType.AZURE
    ? isAzureFileSearchConfigured()
    : isGeminiFileSearchConfigured()

export const createKnowledgeStore = async ({
  name,
  type,
}: {
  name: string
  type: KnowledgeBaseType
}): Promise<KnowledgeBase> => {
  if (type === KnowledgeBaseType.AZURE) {
    return {
      name,
      type,
      config: { vectorStoreId: await createAzureFileStore({ name }) },
    }
  }
  return {
    name,
    type,
    config: { googleFileStoreId: await createGeminiFileStore(name) },
  }
}

export const deleteKnowledgeStore = async (knowledgeBase: KnowledgeBase) => {
  if (knowledgeBase.type === KnowledgeBaseType.AZURE) {
    await deleteAzureVectorStore({
      vectorStoreId: knowledgeBase.config.vectorStoreId,
    })
  } else {
    await deleteGeminiVectorStore(knowledgeBase.config.googleFileStoreId)
  }
}
