const mockDbRemove = jest.fn()
const mockDbTryGet = jest.fn()
const mockDbPut = jest.fn()
const mockDbAllDocs = jest.fn().mockResolvedValue({ rows: [] })
const mockReplacementCache = new Map<string, [string, string][]>()
const mockCacheWithCache = jest.fn(
  async (
    key: string,
    _ttl: number,
    fetchFn: () => Promise<[string, string][]>
  ) => {
    const cached = mockReplacementCache.get(key)
    if (cached) {
      return cached
    }
    const value = await fetchFn()
    mockReplacementCache.set(key, value)
    return value
  }
)
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
const mockCleanupKnowledgeForOperation = jest.fn().mockResolvedValue(undefined)
const mockReconcileAgentJobs = jest.fn().mockResolvedValue({
  clearedSchedules: 0,
  enabledSchedules: 0,
})

jest.mock("../rag/files", () => ({
  cleanupKnowledgeForOperation: (...args: any[]) =>
    mockCleanupKnowledgeForOperation(...args),
}))

jest.mock("../rag/sources/knowledgeSourceSyncQueue", () => ({
  reconcileAgentJobs: (...args: any[]) => mockReconcileAgentJobs(...args),
}))

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    cache: {
      ...actual.cache,
      withCache: (...args: Parameters<typeof mockCacheWithCache>) =>
        mockCacheWithCache(...args),
    },
    context: {
      ...actual.context,
      getOrThrowWorkspaceId: () => "app_1",
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

import { getQueryToolBindings } from "@budibase/shared-core"
import { SourceName, ToolExecutionPrincipal, ToolType } from "@budibase/types"
import type {
  Agent,
  Datasource,
  KnowledgeBase,
  KnowledgeBaseFile,
  Query,
} from "@budibase/types"
import * as agentsCrud from "./crud"
import { generator } from "@budibase/backend-core/tests"

describe("agents crud", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockReplacementCache.clear()
  })

  describe("fetch", () => {
    it("maps legacy query tools without writing the agent", async () => {
      const datasource: Datasource = {
        _id: "datasource_1",
        name: "Legacy API",
        type: "datasource",
        source: SourceName.REST,
        config: {},
      }
      const query: Query = {
        _id: "query_rest_unique_identifier",
        datasourceId: datasource._id!,
        fields: {},
        name: "Get todo",
        parameters: [],
        queryVerb: "read",
        readable: true,
        schema: {},
        transformer: "return data",
      }
      mockDbAllDocs
        .mockResolvedValueOnce({
          rows: [
            {
              doc: {
                _id: "agent_legacy",
                _rev: "1-abc",
                name: "Legacy Agent",
                aiconfig: "cfg_1",
                operations: [
                  {
                    id: "operation_1",
                    name: "Main",
                    live: true,
                    enabledTools: ["rest_legacy_api_get_todo"],
                  },
                ],
              },
            },
          ],
        })
        .mockResolvedValueOnce({ rows: [{ doc: datasource }] })
        .mockResolvedValueOnce({ rows: [{ doc: query }] })

      const agents = await agentsCrud.fetch()

      expect(agents[0].operations?.[0].enabledTools).toEqual([
        {
          toolName: getQueryToolBindings({
            sourceType: ToolType.REST_QUERY,
            sourceLabel: datasource.name,
            queryName: query.name,
            queryId: query._id!,
          }).runtimeBinding,
          executionPrincipal: ToolExecutionPrincipal.ADMIN,
        },
      ])
      expect(mockDbPut).not.toHaveBeenCalled()
    })

    it("skips compatibility lookups for bindings longer than legacy names", async () => {
      const toolName = getQueryToolBindings({
        sourceType: ToolType.REST_QUERY,
        sourceLabel: "A very long datasource name",
        queryName: "A very long query name",
        queryId: "query_0123456789abcdef0123456789abcdef",
      }).runtimeBinding
      mockDbAllDocs.mockResolvedValueOnce({
        rows: [
          {
            doc: {
              _id: "agent_current",
              name: "Current Agent",
              operations: [
                {
                  id: "operation_1",
                  name: "Main",
                  live: true,
                  enabledTools: [toolName],
                },
              ],
            },
          },
        ],
      })

      await agentsCrud.fetch()

      expect(mockDbAllDocs).toHaveBeenCalledTimes(1)
      expect(mockCacheWithCache).not.toHaveBeenCalled()
    })

    it("caches lookups for bindings that could be legacy names", async () => {
      const agent = {
        _id: "agent_legacy",
        name: "Legacy Agent",
        operations: [
          {
            id: "operation_1",
            name: "Main",
            live: true,
            enabledTools: ["rest_api_get_todo"],
          },
        ],
      }
      mockDbAllDocs
        .mockResolvedValueOnce({ rows: [{ doc: agent }] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ doc: agent }] })

      await agentsCrud.fetch()
      await agentsCrud.fetch()

      expect(mockDbAllDocs).toHaveBeenCalledTimes(4)
      expect(mockCacheWithCache).toHaveBeenCalledTimes(2)
    })

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
              name: "Main operation",
              live: true,
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

    it("returns no operations when operations is explicitly empty", async () => {
      mockDbAllDocs.mockResolvedValue({
        rows: [
          {
            doc: {
              _id: "agent_blank",
              _rev: "1-abc",
              name: "Blank Agent",
              aiconfig: "cfg_1",
              operations: [],
            },
          },
        ],
      })

      const agents = await agentsCrud.fetch()

      expect(agents).toEqual([
        expect.objectContaining({
          _id: "agent_blank",
          operations: [],
        }),
      ])
    })
  })

  describe("getOrThrow", () => {
    it("maps legacy query tools on read and persists them on save", async () => {
      const datasource: Datasource = {
        _id: "datasource_1",
        name: "Warehouse",
        type: "datasource",
        source: SourceName.POSTGRES,
        config: {},
      }
      const query: Query = {
        _id: "query_sql_unique_identifier",
        datasourceId: datasource._id!,
        fields: {},
        name: "Monthly sales",
        parameters: [],
        queryVerb: "read",
        readable: true,
        schema: {},
        transformer: "return data",
      }
      mockDbTryGet.mockResolvedValue({
        _id: "agent_legacy",
        _rev: "1-abc",
        name: "Legacy Agent",
        aiconfig: "cfg_1",
        operations: [
          {
            id: "operation_1",
            name: "Main",
            live: true,
            enabledTools: ["ds_warehouse_monthly_sales"],
          },
        ],
      })
      mockDbAllDocs
        .mockResolvedValueOnce({ rows: [{ doc: datasource }] })
        .mockResolvedValueOnce({ rows: [{ doc: query }] })

      const agent = await agentsCrud.getOrThrow("agent_legacy")

      expect(agent.operations?.[0].enabledTools).toEqual([
        {
          toolName: getQueryToolBindings({
            sourceType: ToolType.DATASOURCE_QUERY,
            sourceLabel: datasource.name,
            queryName: query.name,
            queryId: query._id!,
          }).runtimeBinding,
          executionPrincipal: ToolExecutionPrincipal.ADMIN,
        },
      ])
      expect(mockDbPut).not.toHaveBeenCalled()

      mockDbPut.mockResolvedValue({ rev: "2-abc" })

      await agentsCrud.update(agent)

      expect(mockDbAllDocs).toHaveBeenCalledTimes(2)
      expect(mockDbPut).toHaveBeenCalledWith(
        expect.objectContaining({
          operations: [
            expect.objectContaining({
              enabledTools: agent.operations?.[0].enabledTools,
            }),
          ],
        })
      )
    })

    it("strips the deprecated chatAppId from persisted integrations", async () => {
      mockDbTryGet.mockResolvedValue({
        _id: "agent_legacy_chat_app",
        _rev: "1-abc",
        name: "Legacy Chat App Agent",
        aiconfig: "cfg_1",
        operations: [],
        slackIntegration: {
          chatAppId: "chatapp_1",
          botToken: "xoxb-token",
          teamId: "T123",
        },
        MSTeamsIntegration: {
          chatAppId: "chatapp_1",
          appId: "teams-app",
        },
      })

      const agent = await agentsCrud.getOrThrow("agent_legacy_chat_app")

      expect(agent.slackIntegration).not.toHaveProperty("chatAppId")
      expect(agent.MSTeamsIntegration).not.toHaveProperty("chatAppId")
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
            allowKnowledgeSourceDownload: generator.bool(),
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

    it("drops the deprecated chatAppId when resaving a legacy agent", async () => {
      mockDbTryGet.mockResolvedValue({
        _id: "agent_upd",
        _rev: "1-abc",
        name: "Original Name",
        aiconfig: "cfg_1",
        operations: [],
        slackIntegration: {
          chatAppId: "chatapp_1",
          botToken: "xoxb-token",
          teamId: "T123",
        },
        MSTeamsIntegration: {
          chatAppId: "chatapp_1",
          appId: "teams-app",
        },
      })
      mockDbPut.mockResolvedValue({ rev: "2-abc" })

      const existing = await agentsCrud.getOrThrow("agent_upd")
      const updated = await agentsCrud.update({
        ...existing,
        name: "Updated Name",
      })

      const [persisted] = mockDbPut.mock.calls[0]
      expect(persisted.slackIntegration).not.toHaveProperty("chatAppId")
      expect(persisted.MSTeamsIntegration).not.toHaveProperty("chatAppId")
      expect(updated.slackIntegration).not.toHaveProperty("chatAppId")
      expect(updated.MSTeamsIntegration).not.toHaveProperty("chatAppId")
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
            allowKnowledgeSourceDownload: generator.bool(),
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
            allowKnowledgeSourceDownload: generator.bool(),
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
      expect(mockCleanupKnowledgeForOperation).toHaveBeenCalledWith(
        "agent_upd",
        "operation_1"
      )
      expect(mockReconcileAgentJobs).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: "agent_upd",
          operations: [],
        })
      )
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
            allowKnowledgeSourceDownload: generator.bool(),
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
            allowKnowledgeSourceDownload: generator.bool(),
          },
          {
            id: "operation_2",
            name: "Secondary",
            live: false,
            promptInstructions: "Then do more",
            enabledTools: [],
            knowledgeBases: [],
            allowKnowledgeSourceDownload: generator.bool(),
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
