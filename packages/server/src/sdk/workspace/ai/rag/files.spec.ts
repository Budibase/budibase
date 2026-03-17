const mockCreateVectorDb = jest.fn()
const mockEmbedMany = jest.fn()
const mockCreateLLM = jest.fn()
const mockKnowledgeBaseFind = jest.fn()
const mockListKnowledgeBaseFiles = jest.fn()

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
    listKnowledgeBaseFiles: (...args: any[]) => mockListKnowledgeBaseFiles(...args),
  },
}))

import {
  FeatureFlag,
  KnowledgeBase,
  KnowledgeBaseFile,
  KnowledgeBaseFileStatus,
} from "@budibase/types"
import { ingestKnowledgeBaseFile, retrieveContextForAgent } from "./files"
import { features, tenancy } from "@budibase/backend-core"
import { processFileToChunks } from "./processors"

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

  describe("processFileToChunks", () => {
    it("preserves markdown heading context for bullet facts", async () => {
      const chunks = await processFileToChunks({
        buffer: Buffer.from(`
# SpongeBob SquarePants Trivia

## Characters

### SpongeBob SquarePants
- His address is 124 Conch Street.
- He has a pet snail named Gary.
        `),
        filename: "spongebob-trivia.md",
      })

      expect(chunks).toContain(
        [
          "SpongeBob SquarePants Trivia > Characters > SpongeBob SquarePants",
          "His address is 124 Conch Street.",
          "SpongeBob SquarePants Trivia > Characters > SpongeBob SquarePants",
          "He has a pet snail named Gary.",
        ].join("\n")
      )
    })

    it("turns markdown tables into retrievable text facts", async () => {
      const chunks = await processFileToChunks({
        buffer: Buffer.from(`
## Locations in Bikini Bottom

| Location | Description |
|---|---|
| Krusty Krab | SpongeBob and Squidward's workplace |
| Goo Lagoon | Bikini Bottom's beach and recreational area |
        `),
        filename: "locations.md",
      })

      expect(chunks).toContain(
        [
          "Locations in Bikini Bottom",
          "Location: Krusty Krab; Description: SpongeBob and Squidward's workplace",
        ].join("\n")
      )
      expect(chunks).toContain(
        [
          "Locations in Bikini Bottom",
          "Location: Goo Lagoon; Description: Bikini Bottom's beach and recreational area",
        ].join("\n")
      )
    })
  })

  describe("retrieveContextForAgent", () => {
    it("falls back to the nearest chunks when the distance threshold removes all matches", async () => {
      const vectorDb = {
        queryNearest: jest.fn().mockResolvedValue([
          {
            source: "rag_source_123",
            chunkText:
              "SpongeBob SquarePants Trivia > Characters > SpongeBob SquarePants\nHis address is 124 Conch Street.",
            chunkHash: "chunk-1",
            distance: 0.42,
          },
        ]),
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
      mockListKnowledgeBaseFiles.mockResolvedValue([
        {
          _id: "file_123",
          knowledgeBaseId: "kb_123",
          filename: "spongebob-trivia.md",
          objectStoreKey: "key",
          ragSourceId: "rag_source_123",
          status: KnowledgeBaseFileStatus.READY,
          chunkCount: 1,
          uploadedBy: "user_123",
        },
      ])

      const agent = {
        knowledgeBases: ["kb_123"],
      } as any

      const result = await tenancy.doInTenant("tenant", () =>
        features.testutils.withFeatureFlags(
          "tenant",
          { [FeatureFlag.AI_RAG]: true },
          () => retrieveContextForAgent(agent, "What is SpongeBob's address?")
        )
      )

      expect(vectorDb.queryNearest).toHaveBeenCalledWith(
        [0.1, 0.2, 0.3],
        ["rag_source_123"],
        8
      )
      expect(result.text).toContain("His address is 124 Conch Street.")
      expect(result.sources).toEqual([
        {
          sourceId: "rag_source_123",
          fileId: "file_123",
          filename: "spongebob-trivia.md",
          chunkCount: 1,
        },
      ])
    })

    it("still prefers threshold-qualified matches over fallback candidates", async () => {
      const vectorDb = {
        queryNearest: jest.fn().mockResolvedValue([
          {
            source: "rag_source_123",
            chunkText: "Fallback chunk",
            chunkHash: "chunk-1",
            distance: 0.42,
          },
          {
            source: "rag_source_123",
            chunkText: "Qualified chunk",
            chunkHash: "chunk-2",
            distance: 0.18,
          },
        ]),
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
      mockListKnowledgeBaseFiles.mockResolvedValue([
        {
          _id: "file_123",
          knowledgeBaseId: "kb_123",
          filename: "spongebob-trivia.md",
          objectStoreKey: "key",
          ragSourceId: "rag_source_123",
          status: KnowledgeBaseFileStatus.READY,
          chunkCount: 2,
          uploadedBy: "user_123",
        },
      ])

      const agent = {
        knowledgeBases: ["kb_123"],
      } as any

      const result = await tenancy.doInTenant("tenant", () =>
        features.testutils.withFeatureFlags(
          "tenant",
          { [FeatureFlag.AI_RAG]: true },
          () => retrieveContextForAgent(agent, "What is SpongeBob's address?")
        )
      )

      expect(result.text).toContain("Qualified chunk")
      expect(result.text).not.toContain("Fallback chunk")
    })

    it("does not use fallback when nearest candidates are too weak", async () => {
      const vectorDb = {
        queryNearest: jest.fn().mockResolvedValue([
          {
            source: "rag_source_123",
            chunkText: "Weak chunk 1",
            chunkHash: "chunk-1",
            distance: 0.61,
          },
          {
            source: "rag_source_123",
            chunkText: "Weak chunk 2",
            chunkHash: "chunk-2",
            distance: 0.64,
          },
        ]),
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

      const agent = {
        knowledgeBases: ["kb_123"],
      } as any

      const result = await tenancy.doInTenant("tenant", () =>
        features.testutils.withFeatureFlags(
          "tenant",
          { [FeatureFlag.AI_RAG]: true },
          () => retrieveContextForAgent(agent, "Good morning")
        )
      )

      expect(result).toEqual({ text: "", chunks: [], sources: [] })
      expect(vectorDb.queryNearest).toHaveBeenCalled()
    })

    it("does not use fallback when nearest candidates are ambiguous", async () => {
      const vectorDb = {
        queryNearest: jest.fn().mockResolvedValue([
          {
            source: "rag_source_123",
            chunkText: "Ambiguous chunk 1",
            chunkHash: "chunk-1",
            distance: 0.41,
          },
          {
            source: "rag_source_123",
            chunkText: "Ambiguous chunk 2",
            chunkHash: "chunk-2",
            distance: 0.43,
          },
        ]),
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
      mockListKnowledgeBaseFiles.mockResolvedValue([
        {
          _id: "file_123",
          knowledgeBaseId: "kb_123",
          filename: "spongebob-trivia.md",
          objectStoreKey: "key",
          ragSourceId: "rag_source_123",
          status: KnowledgeBaseFileStatus.READY,
          chunkCount: 2,
          uploadedBy: "user_123",
        },
      ])

      const agent = {
        knowledgeBases: ["kb_123"],
      } as any

      const result = await tenancy.doInTenant("tenant", () =>
        features.testutils.withFeatureFlags(
          "tenant",
          { [FeatureFlag.AI_RAG]: true },
          () => retrieveContextForAgent(agent, "Good morning")
        )
      )

      expect(result).toEqual({ text: "", chunks: [], sources: [] })
    })
  })
})
