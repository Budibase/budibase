const mockCreateVectorDb = jest.fn()
const mockEmbedMany = jest.fn()
const mockCreateLLM = jest.fn()

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

import {
  AgentFileStatus,
  FeatureFlag,
  type Agent,
  type AgentFile,
} from "@budibase/types"
import { ingestAgentFile } from "./files"
import { features, tenancy } from "@budibase/backend-core"

describe("rag files", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("ingestAgentFile", () => {
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

      const agent: Agent = {
        _id: "agent_123",
        name: "Agent",
        aiconfig: "ai_config",
        embeddingModel: "embedding_config",
      }

      const agentFile: AgentFile = {
        _id: "file_123",
        agentId: "agent_123",
        filename: "test.txt",
        objectStoreKey: "key",
        ragSourceId: "rag_source_123",
        status: AgentFileStatus.READY,
        chunkCount: 0,
        uploadedBy: "user_123",
      }

      await tenancy.doInTenant("tenant", () =>
        features.testutils.withFeatureFlags(
          "tenant",
          { [FeatureFlag.AI_RAG]: true },
          () => ingestAgentFile(agent, agentFile, Buffer.from("hello world"))
        )
      )

      expect(mockCreateLLM).toHaveBeenCalledTimes(1)
      expect(mockCreateLLM).toHaveBeenCalledWith("embedding_config")
    })
  })
})
