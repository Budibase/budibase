const mockDbRemove = jest.fn()
const mockDbTryGet = jest.fn()
const mockGetWorkspaceDB = jest.fn(() => ({
  tryGet: (...args: any[]) => mockDbTryGet(...args),
  remove: (...args: any[]) => mockDbRemove(...args),
}))

const mockKnowledgeBaseFind = jest.fn()
const mockKnowledgeBaseListFiles = jest.fn()
const mockKnowledgeBaseRemoveFile = jest.fn()
const mockKnowledgeBaseRemove = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceDB: (...args: Parameters<typeof mockGetWorkspaceDB>) =>
        mockGetWorkspaceDB(...args),
    },
  }
})

jest.mock("../knowledgeBase", () => ({
  find: (...args: any[]) => mockKnowledgeBaseFind(...args),
  listKnowledgeBaseFiles: (...args: any[]) =>
    mockKnowledgeBaseListFiles(...args),
  removeKnowledgeBaseFile: (...args: any[]) =>
    mockKnowledgeBaseRemoveFile(...args),
  remove: (...args: any[]) => mockKnowledgeBaseRemove(...args),
}))

import type { Agent, KnowledgeBase, KnowledgeBaseFile } from "@budibase/types"
import * as agentsCrud from "./crud"

describe("agents crud", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("remove", () => {
    it("cascades KB file and KB deletion before deleting the agent", async () => {
      const agent = {
        _id: "agent_1",
        _rev: "1-abc",
        name: "Agent 1",
        knowledgeBases: ["kb_1"],
      } as Agent
      const knowledgeBase = {
        _id: "kb_1",
        name: "Agent files",
      } as KnowledgeBase
      const files = [
        {
          _id: "file_1",
          knowledgeBaseId: "kb_1",
          filename: "doc-1.pdf",
        },
        {
          _id: "file_2",
          knowledgeBaseId: "kb_1",
          filename: "doc-2.pdf",
        },
      ] as KnowledgeBaseFile[]

      mockDbTryGet.mockResolvedValue(agent)
      mockKnowledgeBaseFind.mockResolvedValue(knowledgeBase)
      mockKnowledgeBaseListFiles.mockResolvedValue(files)

      await agentsCrud.remove("agent_1")

      expect(mockKnowledgeBaseFind).toHaveBeenCalledWith("kb_1")
      expect(mockKnowledgeBaseListFiles).toHaveBeenCalledWith("kb_1")
      expect(mockKnowledgeBaseRemoveFile).toHaveBeenCalledTimes(2)
      expect(mockKnowledgeBaseRemoveFile).toHaveBeenNthCalledWith(
        1,
        knowledgeBase,
        files[0]
      )
      expect(mockKnowledgeBaseRemoveFile).toHaveBeenNthCalledWith(
        2,
        knowledgeBase,
        files[1]
      )
      expect(mockKnowledgeBaseRemove).toHaveBeenCalledWith("kb_1")
      expect(mockDbRemove).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: agent._id,
          _rev: agent._rev,
          name: agent.name,
          knowledgeBases: agent.knowledgeBases,
        })
      )
    })

    it("skips missing KBs and still deletes the agent", async () => {
      const agent = {
        _id: "agent_2",
        _rev: "1-def",
        name: "Agent 2",
        knowledgeBases: ["kb_missing"],
      } as Agent

      mockDbTryGet.mockResolvedValue(agent)
      mockKnowledgeBaseFind.mockResolvedValue(undefined)

      await agentsCrud.remove("agent_2")

      expect(mockKnowledgeBaseListFiles).not.toHaveBeenCalled()
      expect(mockKnowledgeBaseRemoveFile).not.toHaveBeenCalled()
      expect(mockKnowledgeBaseRemove).not.toHaveBeenCalled()
      expect(mockDbRemove).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: agent._id,
          _rev: agent._rev,
          name: agent.name,
          knowledgeBases: agent.knowledgeBases,
        })
      )
    })

    it("deletes the agent even when KB cleanup fails", async () => {
      const agent = {
        _id: "agent_3",
        _rev: "1-ghi",
        name: "Agent 3",
        knowledgeBases: ["kb_3"],
      } as Agent
      const knowledgeBase = {
        _id: "kb_3",
        name: "Agent files 3",
      } as KnowledgeBase
      const files = [
        {
          _id: "file_3",
          knowledgeBaseId: "kb_3",
          filename: "doc-3.pdf",
        },
      ] as KnowledgeBaseFile[]

      jest.spyOn(console, "log").mockImplementation(() => {})
      mockDbTryGet.mockResolvedValue(agent)
      mockKnowledgeBaseFind.mockResolvedValue(knowledgeBase)
      mockKnowledgeBaseListFiles.mockResolvedValue(files)
      mockKnowledgeBaseRemoveFile.mockRejectedValue(
        new Error("file cleanup failed")
      )
      mockKnowledgeBaseRemove.mockRejectedValue(new Error("kb cleanup failed"))

      await agentsCrud.remove("agent_3")

      expect(mockKnowledgeBaseRemoveFile).toHaveBeenCalledTimes(1)
      expect(mockKnowledgeBaseRemove).toHaveBeenCalledWith("kb_3")
      expect(mockDbRemove).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: agent._id,
          _rev: agent._rev,
          name: agent.name,
        })
      )
    })
  })
})
