import type { createVectorDb, VectorDbClient } from "../vectorDb/utils"
import type { embedMany, EmbedManyResult } from "ai"
import type { createLLM } from "../llm"
import type { find, listKnowledgeBaseFiles } from "../knowledgeBase"

const mockCreateVectorDb = jest.fn() as jest.MockedFunction<
  typeof createVectorDb
>
const mockEmbedMany = jest.fn() as jest.MockedFunction<typeof embedMany>
const mockCreateLLM = jest.fn() as jest.MockedFunction<typeof createLLM>
const mockKnowledgeBaseFind = jest.fn() as jest.MockedFunction<typeof find>
const mockListKnowledgeBaseFiles = jest.fn() as jest.MockedFunction<
  typeof listKnowledgeBaseFiles
>

jest.mock("../vectorDb/utils", () => ({
  createVectorDb: (...args: Parameters<typeof createVectorDb>) =>
    mockCreateVectorDb(...args),
}))

jest.mock("ai", () => ({
  tool: jest.fn(),
  embedMany: (...args: Parameters<typeof embedMany>) => mockEmbedMany(...args),
}))

jest.mock("../llm", () => ({
  createLLM: (...args: Parameters<typeof createLLM>) => mockCreateLLM(...args),
}))

jest.mock("..", () => ({
  knowledgeBase: {
    find: (...args: Parameters<typeof find>) => mockKnowledgeBaseFind(...args),
    listKnowledgeBaseFiles: (
      ...args: Parameters<typeof listKnowledgeBaseFiles>
    ) => mockListKnowledgeBaseFiles(...args),
  },
}))

import {
  FeatureFlag,
  KnowledgeBase,
  KnowledgeBaseFile,
  KnowledgeBaseFileStatus,
  LLMResponse,
} from "@budibase/types"
import { ingestKnowledgeBaseFile, retrieveContextForAgent } from "./files"
import { features, tenancy } from "@budibase/backend-core"
import { processFileToChunks } from "./processors"
import { structures } from "../../../../api/routes/tests/utilities"

describe("rag files", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  function setMockCreateVectorDb(vectorDb: Partial<VectorDbClient>) {
    mockCreateVectorDb.mockResolvedValue(vectorDb as VectorDbClient)
  }

  function setMockCreateLLM(llm: Partial<LLMResponse>) {
    mockCreateLLM.mockResolvedValue(llm as LLMResponse)
  }

  function setMockEmbedMany(embeddings: Partial<EmbedManyResult>) {
    mockEmbedMany.mockResolvedValue(embeddings as EmbedManyResult)
  }

  function setMockKnowledgeBaseFind(kb: KnowledgeBase) {
    mockKnowledgeBaseFind.mockResolvedValue(kb)
  }

  describe("ingestKnowledgeBaseFile", () => {
    it("uses the embedding model config for embeddings", async () => {
      const vectorDb = {
        deleteBySourceIds: jest.fn(),
        upsertSourceChunks: jest.fn().mockResolvedValue({
          inserted: 1,
          total: 1,
        }),
        queryNearest: jest.fn(),
      } satisfies VectorDbClient

      const kb = structures.ai.knowledgeBase.basicKnowledgeBase()
      const kbId = kb._id!

      setMockCreateVectorDb(vectorDb)
      setMockCreateLLM({
        embedding: {} as LLMResponse["embedding"],
      })
      setMockEmbedMany({ embeddings: [[0.1, 0.2, 0.3]] })
      setMockKnowledgeBaseFind(kb)

      const knowledgeBase: KnowledgeBase = {
        _id: kbId,
        name: "Knowledge Base",
        embeddingModel: "embedding_config",
        vectorDb: "vector_db",
      }

      const knowledgeBaseFile: KnowledgeBaseFile = {
        _id: "file_123",
        knowledgeBaseId: kbId,
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
# Product Support Knowledge Base

## Account Management

### Password Reset Policy
- Users can reset passwords from the account security page.
- Password reset links expire after 30 minutes.
        `),
        filename: "account-policy.md",
      })

      expect(chunks).toContain(
        [
          "Product Support Knowledge Base > Account Management > Password Reset Policy",
          "Users can reset passwords from the account security page.",
        ].join("\n")
      )
      expect(chunks).toContain(
        [
          "Product Support Knowledge Base > Account Management > Password Reset Policy",
          "Password reset links expire after 30 minutes.",
        ].join("\n")
      )
    })

    it("keeps formatted heading text in context", async () => {
      const chunks = await processFileToChunks({
        buffer: Buffer.from(`
## The **Incident Response** Runbook \`v2\`

- Escalation path: Security Operations
        `),
        filename: "incident-runbook.md",
      })

      expect(chunks).toContain(
        [
          "> The **Incident Response** Runbook `v2`",
          "Escalation path: Security Operations",
        ].join("\n")
      )
    })

    it("turns markdown tables into retrievable text facts", async () => {
      const chunks = await processFileToChunks({
        buffer: Buffer.from(`
## Regional Offices

| Location | Description |
|---|---|
| Paris | European support and compliance operations |
| New York | North American customer success operations |
        `),
        filename: "regional-offices.md",
      })

      expect(chunks).toContain(
        [
          " > Regional Offices",
          "Location: Paris; Description: European support and compliance operations",
        ].join("\n")
      )
      expect(chunks).toContain(
        [
          " > Regional Offices",
          "Location: New York; Description: North American customer success operations",
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
              "Product Support Knowledge Base > Account Management > Password Reset Policy\nUsers can reset passwords from the account security page.",
            chunkHash: "chunk-1",
            distance: 0.42,
          },
        ]),
      }

      const kb = structures.ai.knowledgeBase.basicKnowledgeBase()
      const kbId = kb._id!

      setMockCreateVectorDb(vectorDb)
      setMockCreateLLM({ embedding: {} as LLMResponse["embedding"] })
      setMockEmbedMany({ embeddings: [[0.1, 0.2, 0.3]] })
      setMockKnowledgeBaseFind(kb)
      mockListKnowledgeBaseFiles.mockResolvedValue([
        {
          _id: "file_123",
          knowledgeBaseId: kbId,
          filename: "account-policy.md",
          objectStoreKey: "key",
          ragSourceId: "rag_source_123",
          status: KnowledgeBaseFileStatus.READY,
          chunkCount: 1,
          uploadedBy: "user_123",
        },
      ])

      const agent = structures.ai.agents.basicAgent({ knowledgeBases: [kbId] })

      const result = await tenancy.doInTenant("tenant", () =>
        features.testutils.withFeatureFlags(
          "tenant",
          { [FeatureFlag.AI_RAG]: true },
          () =>
            retrieveContextForAgent(
              agent,
              "How can users reset their password?"
            )
        )
      )

      expect(vectorDb.queryNearest).toHaveBeenCalledWith(
        [0.1, 0.2, 0.3],
        ["rag_source_123"],
        20
      )
      expect(result.text).toContain(
        "Users can reset passwords from the account security page."
      )
      expect(result.sources).toEqual([
        {
          sourceId: "rag_source_123",
          fileId: "file_123",
          filename: "account-policy.md",
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

      const kb = structures.ai.knowledgeBase.basicKnowledgeBase()
      const kbId = kb._id!

      setMockCreateVectorDb(vectorDb)
      setMockCreateLLM({ embedding: {} as LLMResponse["embedding"] })
      setMockEmbedMany({ embeddings: [[0.1, 0.2, 0.3]] })
      setMockKnowledgeBaseFind(kb)
      mockListKnowledgeBaseFiles.mockResolvedValue([
        {
          _id: "file_123",
          knowledgeBaseId: kbId,
          filename: "account-policy.md",
          objectStoreKey: "key",
          ragSourceId: "rag_source_123",
          status: KnowledgeBaseFileStatus.READY,
          chunkCount: 2,
          uploadedBy: "user_123",
        },
      ])

      const agent = structures.ai.agents.basicAgent({ knowledgeBases: [kbId] })

      const result = await tenancy.doInTenant("tenant", () =>
        features.testutils.withFeatureFlags(
          "tenant",
          { [FeatureFlag.AI_RAG]: true },
          () =>
            retrieveContextForAgent(
              agent,
              "How can users reset their password?"
            )
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

      const kb = structures.ai.knowledgeBase.basicKnowledgeBase()
      const kbId = kb._id!

      setMockCreateVectorDb(vectorDb)
      setMockCreateLLM({ embedding: {} as LLMResponse["embedding"] })
      setMockEmbedMany({ embeddings: [[0.1, 0.2, 0.3]] })
      setMockKnowledgeBaseFind(kb)
      mockListKnowledgeBaseFiles.mockResolvedValue([
        {
          _id: "file_123",
          knowledgeBaseId: kbId,
          filename: "account-policy.md",
          objectStoreKey: "key",
          ragSourceId: "rag_source_123",
          status: KnowledgeBaseFileStatus.READY,
          chunkCount: 2,
          uploadedBy: "user_123",
        },
      ])

      const agent = structures.ai.agents.basicAgent({ knowledgeBases: [kbId] })

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

    it("uses fallback when nearest candidates are close but from the same source", async () => {
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

      const kb = structures.ai.knowledgeBase.basicKnowledgeBase()
      const kbId = kb._id!

      setMockCreateVectorDb(vectorDb)
      setMockCreateLLM({ embedding: {} as LLMResponse["embedding"] })
      setMockEmbedMany({ embeddings: [[0.1, 0.2, 0.3]] })
      setMockKnowledgeBaseFind(kb)
      mockListKnowledgeBaseFiles.mockResolvedValue([
        {
          _id: "file_123",
          knowledgeBaseId: kbId,
          filename: "account-policy.md",
          objectStoreKey: "key",
          ragSourceId: "rag_source_123",
          status: KnowledgeBaseFileStatus.READY,
          chunkCount: 2,
          uploadedBy: "user_123",
        },
      ])

      const agent = structures.ai.agents.basicAgent({ knowledgeBases: [kbId] })

      const result = await tenancy.doInTenant("tenant", () =>
        features.testutils.withFeatureFlags(
          "tenant",
          { [FeatureFlag.AI_RAG]: true },
          () => retrieveContextForAgent(agent, "Good morning")
        )
      )

      expect(result.text).toContain("Ambiguous chunk 1")
      expect(result.text).toContain("Ambiguous chunk 2")
      expect(result.sources).toEqual([
        {
          sourceId: "rag_source_123",
          fileId: "file_123",
          filename: "account-policy.md",
          chunkCount: 2,
        },
      ])
    })
  })
})
