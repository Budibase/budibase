const mockKnowledgeBaseFind = jest.fn()
const mockKnowledgeBaseListFiles = jest.fn()

const mockProcessorIngest = jest.fn()
const mockProcessorSearch = jest.fn()
const mockProcessorDelete = jest.fn()

jest.mock("..", () => ({
  knowledgeBase: {
    find: (...args: any[]) => mockKnowledgeBaseFind(...args),
    listKnowledgeBaseFiles: (...args: any[]) =>
      mockKnowledgeBaseListFiles(...args),
  },
}))

jest.mock("./processors/gemini", () => ({
  GeminiRagProcessor: jest.fn().mockImplementation(() => ({
    ingestKnowledgeBaseFile: (...args: any[]) => mockProcessorIngest(...args),
    search: (...args: any[]) => mockProcessorSearch(...args),
    deleteFiles: (...args: any[]) => mockProcessorDelete(...args),
  })),
}))

import {
  Agent,
  KnowledgeBase,
  KnowledgeBaseFile,
  KnowledgeBaseFileStatus,
  KnowledgeBaseType,
} from "@budibase/types"
import { GeminiRagProcessor } from "./processors/gemini"
import {
  deleteKnowledgeBaseFileChunks,
  ingestKnowledgeBaseFile,
  retrieveContextForAgent,
} from "./files"

describe("rag files", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("ingestKnowledgeBaseFile", () => {
    it("delegates ingestion to the Gemini processor", async () => {
      const knowledgeBase: KnowledgeBase = {
        _id: "kb_123",
        name: "Knowledge Base",
        type: KnowledgeBaseType.GEMINI,
        config: {
          googleFileStoreId: "file-store-1",
        },
      }

      const knowledgeBaseFile: KnowledgeBaseFile = {
        _id: "file_123",
        knowledgeBaseId: "kb_123",
        filename: "test.txt",
        objectStoreKey: "key",
        ragSourceId: "rag_source_123",
        status: KnowledgeBaseFileStatus.PROCESSING,
        uploadedBy: "user_123",
      }

      const fileBuffer = Buffer.from("hello world")

      await ingestKnowledgeBaseFile(
        knowledgeBase,
        knowledgeBaseFile,
        fileBuffer
      )

      expect(GeminiRagProcessor).toHaveBeenCalledTimes(1)
      expect(GeminiRagProcessor).toHaveBeenCalledWith(knowledgeBase)
      expect(mockProcessorIngest).toHaveBeenCalledTimes(1)
      expect(mockProcessorIngest).toHaveBeenCalledWith(
        knowledgeBaseFile,
        fileBuffer
      )
    })

    it("throws when knowledge base id is missing", async () => {
      const knowledgeBase = {
        name: "Knowledge Base",
        type: KnowledgeBaseType.GEMINI,
        config: {
          googleFileStoreId: "file-store-1",
        },
      } as KnowledgeBase

      const knowledgeBaseFile: KnowledgeBaseFile = {
        _id: "file_123",
        knowledgeBaseId: "kb_123",
        filename: "test.txt",
        objectStoreKey: "key",
        ragSourceId: "rag_source_123",
        status: KnowledgeBaseFileStatus.PROCESSING,
        uploadedBy: "user_123",
      }

      await expect(
        ingestKnowledgeBaseFile(
          knowledgeBase,
          knowledgeBaseFile,
          Buffer.from("x")
        )
      ).rejects.toThrow("Knowledge base id not set")
    })
  })

  describe("deleteKnowledgeBaseFileChunks", () => {
    it("delegates delete calls to the Gemini processor", async () => {
      const knowledgeBase: KnowledgeBase = {
        _id: "kb_123",
        name: "Knowledge Base",
        type: KnowledgeBaseType.GEMINI,
        config: {
          googleFileStoreId: "file-store-1",
        },
      }

      await deleteKnowledgeBaseFileChunks(knowledgeBase, [
        "source-1",
        "source-2",
      ])

      expect(GeminiRagProcessor).toHaveBeenCalledWith(knowledgeBase)
      expect(mockProcessorDelete).toHaveBeenCalledWith(["source-1", "source-2"])
    })

    it("does not call processor when there are no source ids", async () => {
      const knowledgeBase: KnowledgeBase = {
        _id: "kb_123",
        name: "Knowledge Base",
        type: KnowledgeBaseType.GEMINI,
        config: {
          googleFileStoreId: "file-store-1",
        },
      }

      await deleteKnowledgeBaseFileChunks(knowledgeBase, [])

      expect(mockProcessorDelete).not.toHaveBeenCalled()
    })
  })

  describe("retrieveContextForAgent", () => {
    it("returns empty context without searching when no knowledge bases are configured", async () => {
      const agent = {
        _id: "agent_1",
        name: "agent_name",
        aiconfig: "config",
        knowledgeBases: [],
      } satisfies Agent

      const result = await retrieveContextForAgent(agent, "What is Budibase?")

      expect(result).toEqual({
        text: "",
        chunks: [],
        sources: [],
      })
      expect(mockKnowledgeBaseFind).not.toHaveBeenCalled()
      expect(mockProcessorSearch).not.toHaveBeenCalled()
    })

    it("returns empty context for an empty question", async () => {
      const agent = {
        _id: "agent_1",
        knowledgeBases: ["kb_1"],
      } as Agent

      const result = await retrieveContextForAgent(agent, "  ")

      expect(result).toEqual({
        text: "",
        chunks: [],
        sources: [],
      })
    })

    it("returns empty context when knowledge base ids are invalid", async () => {
      const agent = {
        _id: "agent_1",
        knowledgeBases: ["missing_1", "missing_2"],
      } as Agent
      mockKnowledgeBaseFind.mockResolvedValue(undefined)

      const result = await retrieveContextForAgent(agent, "What is Budibase?")

      expect(result).toEqual({
        text: "",
        chunks: [],
        sources: [],
      })
    })

    it("maps chunks to source metadata", async () => {
      const knowledgeBase: KnowledgeBase = {
        _id: "kb_123",
        name: "Knowledge Base",
        type: KnowledgeBaseType.GEMINI,
        config: {
          googleFileStoreId: "file-store-1",
        },
      }
      const agent = {
        _id: "agent_1",
        knowledgeBases: [knowledgeBase._id],
      } as Agent

      mockKnowledgeBaseFind.mockResolvedValue(knowledgeBase)
      mockKnowledgeBaseListFiles.mockResolvedValue([
        {
          _id: "file_1",
          knowledgeBaseId: "kb_123",
          filename: "policy.md",
          objectStoreKey: "obj",
          ragSourceId: "source-1",
          status: KnowledgeBaseFileStatus.READY,
          uploadedBy: "user_1",
        } as KnowledgeBaseFile,
      ])
      mockProcessorSearch.mockResolvedValue([
        {
          source: "policy.md",
          chunkText: "4-day in-office policy",
        },
      ])

      const result = await retrieveContextForAgent(agent, "What is the policy?")

      expect(result.text).toBe("4-day in-office policy")
      expect(result.chunks).toEqual([
        {
          source: "policy.md",
          chunkText: "4-day in-office policy",
        },
      ])
      expect(result.sources).toEqual([
        {
          sourceId: "policy.md",
          filename: "policy.md",
        },
      ])
    })
  })
})
