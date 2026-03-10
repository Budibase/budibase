const mockCreateVectorDb = jest.fn()
const mockEmbedMany = jest.fn()
const mockCreateLLM = jest.fn()
const mockKnowledgeBaseFind = jest.fn()

jest.mock("../vectorDb/utils", () => ({
  createVectorDb: (...args: any[]) => mockCreateVectorDb(...args),
}))

jest.mock("ai", () => ({
  tool: jest.fn(),
  embedMany: (...args: any[]) => mockEmbedMany(...args),
}))

jest.mock("../llm", () => ({
  createLLM: (...args: any[]) => mockCreateLLM(...args),
}))

jest.mock("..", () => ({
  knowledgeBase: {
    find: (...args: any[]) => mockKnowledgeBaseFind(...args),
  },
}))

import {
  FeatureFlag,
  KnowledgeBase,
  KnowledgeBaseFile,
  KnowledgeBaseFileStatus,
} from "@budibase/types"
import { ingestKnowledgeBaseFile } from "./files"
import { features, tenancy } from "@budibase/backend-core"

describe("rag files", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("ingestKnowledgeBaseFile", () => {
    it("uses the embedding model config for embeddings", async () => {
      const vectorDb = {
        deleteBySourceIds: jest.fn(),
        upsertSourceChunks: jest.fn().mockResolvedValue({
          inserted: 1,
          total: 1,
        }),
      }

      mockCreateVectorDb.mockResolvedValue(vectorDb)
      mockCreateLLM.mockResolvedValue({ embedding: "mock-embedding-model" })
      mockEmbedMany.mockResolvedValue({ embeddings: [[0.1, 0.2, 0.3]] })
      mockKnowledgeBaseFind.mockResolvedValue({
        _id: "kb_123",
        name: "KB",
        embeddingModel: "embedding_config",
        vectorDb: "vector_db_config",
      })

      const knowledgeBase: KnowledgeBase = {
        _id: "kb_123",
        name: "Knowledge Base",
        embeddingModel: "embedding_config",
        vectorDb: "vector_db",
      }

      const knowledgeBaseFile: KnowledgeBaseFile = {
        _id: "file_123",
        knowledgeBaseId: "kb_123",
        filename: "test.txt",
        objectStoreKey: "key",
        ragSourceId: "rag_source_123",
        status: KnowledgeBaseFileStatus.READY,
        chunkCount: 0,
        uploadedBy: "user_123",
      }

      await tenancy.doInTenant("tenant", () =>
        features.testutils.withFeatureFlags(
          "tenant",
          { [FeatureFlag.AI_RAG]: true },
          () =>
            ingestKnowledgeBaseFile(
              knowledgeBase,
              knowledgeBaseFile,
              Buffer.from("hello world")
            )
        )
      )

      expect(mockCreateLLM).toHaveBeenCalledTimes(1)
      expect(mockCreateLLM).toHaveBeenCalledWith("embedding_config")
    })
  })
})
