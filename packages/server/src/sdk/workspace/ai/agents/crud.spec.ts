const mockDbRemove = jest.fn()
const mockDbTryGet = jest.fn()
const mockDbPut = jest.fn()
const mockDbAllDocs = jest.fn().mockResolvedValue({ rows: [] })
const mockGetWorkspaceDB = jest.fn(() => ({
  tryGet: (...args: any[]) => mockDbTryGet(...args),
  remove: (...args: any[]) => mockDbRemove(...args),
  put: (...args: any[]) => mockDbPut(...args),
  allDocs: (...args: any[]) => mockDbAllDocs(...args),
}))

const mockAgentCreated = jest.fn()
const mockAgentUpdated = jest.fn()
const mockAgentDeleted = jest.fn()

const mockKnowledgeBaseFind = jest.fn()
const mockKnowledgeBaseListFiles = jest.fn()
const mockKnowledgeBaseRemoveFile = jest.fn()
const mockKnowledgeBaseRemove = jest.fn()
const mockAssertAgentHasValidConfig = jest.fn().mockResolvedValue(undefined)

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceDB: (...args: Parameters<typeof mockGetWorkspaceDB>) =>
        mockGetWorkspaceDB(...args),
    },
    events: {
      ...actual.events,
      ai: {
        agentCreated: (...args: any[]) => mockAgentCreated(...args),
        agentUpdated: (...args: any[]) => mockAgentUpdated(...args),
        agentDeleted: (...args: any[]) => mockAgentDeleted(...args),
      },
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

jest.mock("./utils", () => {
  return {
    assertAgentHasValidConfig: (...args: any[]) =>
      mockAssertAgentHasValidConfig(...args),
  }
})

import type { Agent, KnowledgeBase, KnowledgeBaseFile } from "@budibase/types"
import * as agentsCrud from "./crud"

describe("agents crud", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("fetch", () => {
    it("migrates legacy promptInstructions into the default operation", async () => {
      mockDbAllDocs.mockResolvedValue({
        rows: [
          {
            doc: {
              _id: "agent_legacy",
              _rev: "1-abc",
              name: "Legacy Agent",
              aiconfig: "cfg_1",
              promptInstructions: "Legacy instructions",
            },
          },
        ],
      })

      const agents = await agentsCrud.fetch()

      expect(agents).toEqual([
        expect.objectContaining({
          _id: "agent_legacy",
          name: "Legacy Agent",
          operations: [
            expect.objectContaining({
              id: "operation_default",
              name: "Operation",
              live: false,
              promptInstructions: "Legacy instructions",
            }),
          ],
        }),
      ])
      expect(agents[0]).not.toHaveProperty("promptInstructions")
    })

    it("keeps existing operation promptInstructions when already migrated", async () => {
      mockDbAllDocs.mockResolvedValue({
        rows: [
          {
            doc: {
              _id: "agent_migrated",
              _rev: "1-abc",
              name: "Migrated Agent",
              aiconfig: "cfg_1",
              operations: [
                {
                  id: "operation_1",
                  name: "Primary",
                  live: false,
                  promptInstructions: "Keep me",
                },
              ],
            },
          },
        ],
      })

      const agents = await agentsCrud.fetch()

      expect(agents).toEqual([
        expect.objectContaining({
          _id: "agent_migrated",
          name: "Migrated Agent",
          operations: [
            expect.objectContaining({
              id: "operation_1",
              name: "Primary",
              live: false,
              promptInstructions: "Keep me",
            }),
          ],
        }),
      ])
      expect(agents[0]).not.toHaveProperty("promptInstructions")
    })
  })

  describe("remove", () => {
    it("cascades KB file and KB deletion before deleting the agent", async () => {
      const agent = {
        _id: "agent_1",
        _rev: "1-abc",
        name: "Agent 1",
        operations: [
          {
            id: "operation_1",
            name: "Main operation",
            live: false,
            knowledgeBases: ["kb_1"],
          },
        ],
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
          operations: [
            expect.objectContaining({
              id: "operation_1",
              name: "Main operation",
              live: false,
              knowledgeBases: ["kb_1"],
            }),
          ],
        })
      )
    })

    it("skips missing KBs and still deletes the agent", async () => {
      const agent = {
        _id: "agent_2",
        _rev: "1-def",
        name: "Agent 2",
        operations: [
          {
            id: "operation_1",
            name: "Main operation",
            live: false,
            knowledgeBases: ["kb_missing"],
          },
        ],
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
          operations: [
            expect.objectContaining({
              id: "operation_1",
              name: "Main operation",
              live: false,
              knowledgeBases: ["kb_missing"],
            }),
          ],
        })
      )
    })

    it("emits ai:agent:deleted event", async () => {
      const agent = {
        _id: "agent_del",
        _rev: "1-abc",
        name: "Delete Me",
        operations: [
          {
            id: "operation_1",
            name: "Main operation",
            live: false,
            knowledgeBases: [] as string[],
          },
        ],
      } as Agent

      mockDbTryGet.mockResolvedValue(agent)

      await agentsCrud.remove("agent_del")

      expect(mockAgentDeleted).toHaveBeenCalledWith(
        expect.objectContaining({ _id: "agent_del", name: "Delete Me" })
      )
    })

    it("deletes the agent even when KB cleanup fails", async () => {
      const agent = {
        _id: "agent_3",
        _rev: "1-ghi",
        name: "Agent 3",
        operations: [
          {
            id: "operation_1",
            name: "Main operation",
            live: false,
            knowledgeBases: ["kb_3"],
          },
        ],
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

  describe("create", () => {
    it("emits ai:agent:created event", async () => {
      mockDbPut.mockResolvedValue({ rev: "1-new" })
      mockDbTryGet.mockResolvedValue(undefined)

      await agentsCrud.create({ name: "New Agent", aiconfig: "cfg_1" })

      expect(mockAgentCreated).toHaveBeenCalledWith(
        expect.objectContaining({ name: "New Agent" })
      )
    })

    it("validates the AI config before publishing a live agent", async () => {
      mockDbPut.mockResolvedValue({ rev: "1-new" })
      mockDbTryGet.mockResolvedValue(undefined)

      await agentsCrud.create({
        name: "Live Agent",
        aiconfig: "cfg_1",
        live: true,
      })

      expect(mockAssertAgentHasValidConfig).toHaveBeenCalledTimes(1)
      expect(mockAssertAgentHasValidConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          aiconfig: "cfg_1",
          live: true,
        })
      )
    })
  })

  describe("update", () => {
    it("emits ai:agent:updated event", async () => {
      const existing = {
        _id: "agent_upd",
        _rev: "1-abc",
        name: "Original Name",
        aiconfig: "cfg_1",
        operations: [
          {
            id: "operation_1",
            name: "Main operation",
            live: false,
            enabledTools: [],
            knowledgeBases: [],
          },
        ],
      } as Agent

      mockDbTryGet.mockResolvedValue(existing)
      mockDbPut.mockResolvedValue({ rev: "2-abc" })

      await agentsCrud.update({
        ...existing,
        name: "Updated Name",
      })

      expect(mockAgentUpdated).toHaveBeenCalledWith(
        expect.objectContaining({ _id: "agent_upd", name: "Updated Name" })
      )
    })

    it("validates the AI config before publishing an agent", async () => {
      const existing = {
        _id: "agent_upd",
        _rev: "1-abc",
        name: "Original Name",
        aiconfig: "cfg_1",
        operations: [
          {
            id: "operation_1",
            name: "Main operation",
            live: false,
            enabledTools: [],
            knowledgeBases: [],
          },
        ],
        live: false,
      } as Agent

      mockDbTryGet.mockResolvedValue(existing)
      mockDbPut.mockResolvedValue({ rev: "2-abc" })

      await agentsCrud.update({
        ...existing,
        live: true,
      })

      expect(mockAssertAgentHasValidConfig).toHaveBeenCalledTimes(1)
      expect(mockAssertAgentHasValidConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: "agent_upd",
          aiconfig: "cfg_1",
          live: true,
        })
      )
    })

    it("persists an explicitly empty operations array", async () => {
      const existing = {
        _id: "agent_upd",
        _rev: "1-abc",
        name: "Original Name",
        aiconfig: "cfg_1",
        operations: [
          {
            id: "operation_1",
            name: "Primary",
            live: false,
            promptInstructions: "Do work",
            enabledTools: [],
            knowledgeBases: [],
          },
        ],
      } as Agent

      mockDbTryGet.mockResolvedValue(existing)
      mockDbPut.mockResolvedValue({ rev: "2-abc" })

      const updated = await agentsCrud.update({
        ...existing,
        operations: [],
      })

      expect(mockDbPut).toHaveBeenCalledWith(
        expect.objectContaining({
          operations: [],
        })
      )
      expect(updated.operations).toEqual([])
    })

    it("persists multiple operations without collapsing them", async () => {
      const existing = {
        _id: "agent_upd",
        _rev: "1-abc",
        name: "Original Name",
        aiconfig: "cfg_1",
        operations: [
          {
            id: "operation_1",
            name: "Primary",
            live: false,
            promptInstructions: "Do work",
            enabledTools: [],
            knowledgeBases: [],
          },
        ],
      } as Agent

      mockDbTryGet.mockResolvedValue(existing)
      mockDbPut.mockResolvedValue({ rev: "2-abc" })

      const updated = await agentsCrud.update({
        ...existing,
        operations: [
          {
            id: "operation_1",
            name: "Primary",
            live: false,
            promptInstructions: "Do work",
            enabledTools: [],
            knowledgeBases: [],
          },
          {
            id: "operation_2",
            name: "Secondary",
            live: false,
            promptInstructions: "Then do more",
            enabledTools: [],
            knowledgeBases: [],
          },
        ],
      })

      expect(mockDbPut).toHaveBeenCalledWith(
        expect.objectContaining({
          operations: expect.arrayContaining([
            expect.objectContaining({
              id: "operation_1",
            }),
            expect.objectContaining({
              id: "operation_2",
            }),
          ]),
        })
      )
      expect(updated.operations).toHaveLength(2)
    })
  })
})
