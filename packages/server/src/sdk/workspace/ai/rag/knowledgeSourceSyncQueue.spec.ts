const mockQueueAdd = jest.fn()
const mockQueueProcess = jest.fn()
const mockGetRepeatableJobs = jest.fn()
const mockRemoveRepeatableByKey = jest.fn()
const mockRemoveJobs = jest.fn()
const mockDoInWorkspaceContext = jest.fn()
const mockSyncSharePointSourcesForAgent = jest.fn()
const mockGetAllWorkspaces = jest.fn()
const mockWorkspaceAllDocs = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")

  class MockBudibaseQueue {
    add = (...args: any[]) => mockQueueAdd(...args)
    process = (...args: any[]) => mockQueueProcess(...args)
    getBullQueue = () => ({
      getRepeatableJobs: (...args: any[]) => mockGetRepeatableJobs(...args),
      removeRepeatableByKey: (...args: any[]) =>
        mockRemoveRepeatableByKey(...args),
      removeJobs: (...args: any[]) => mockRemoveJobs(...args),
    })
  }

  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceId: () => "app_dev_test",
      doInWorkspaceContext: (...args: any[]) =>
        mockDoInWorkspaceContext(...args),
      getWorkspaceDB: () => ({
        allDocs: (...args: any[]) => mockWorkspaceAllDocs(...args),
      }),
    },
    db: {
      ...actual.db,
      getAllWorkspaces: (...args: any[]) => mockGetAllWorkspaces(...args),
    },
    queue: {
      ...actual.queue,
      BudibaseQueue: MockBudibaseQueue,
    },
    utils: {
      ...actual.utils,
      Duration: {
        fromSeconds: (s: number) => ({ toMs: () => s * 1000 }),
        fromMinutes: (m: number) => ({ toMs: () => m * 60 * 1000 }),
      },
    },
  }
})

jest.mock("./sharepoint", () => ({
  syncSharePointSourcesForAgent: (...args: any[]) =>
    mockSyncSharePointSourcesForAgent(...args),
}))

import { AgentKnowledgeSourceType, type Agent } from "@budibase/types"
import {
  reconcileAgentJobs,
  rehydrateScheduledJobs,
  removeAllAgentJobs,
  scheduleJob,
} from "./knowledgeSourceSyncQueue"
import { withEnv } from "../../../../environment"

describe("knowledgeSourceSyncQueue", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDoInWorkspaceContext.mockImplementation(
      async (_workspaceId: string, fn: () => Promise<any>) => await fn()
    )
    mockGetRepeatableJobs.mockResolvedValue([])
    mockQueueAdd.mockResolvedValue({ id: "job_1" })
    mockRemoveRepeatableByKey.mockResolvedValue(undefined)
    mockRemoveJobs.mockResolvedValue(undefined)
    mockGetAllWorkspaces.mockResolvedValue(["app_dev_test"])
    mockWorkspaceAllDocs.mockResolvedValue({ rows: [] })
  })

  it("schedules repeatable jobs with deterministic ids", async () => {
    await scheduleJob({
      workspaceId: "app_dev_test",
      agentId: "agent_1",
      sourceType: AgentKnowledgeSourceType.SHAREPOINT,
      sourceId: "sharepoint_site_site_1",
    })

    expect(mockQueueAdd).toHaveBeenCalledWith(
      {
        workspaceId: "app_dev_test",
        agentId: "agent_1",
        sourceType: AgentKnowledgeSourceType.SHAREPOINT,
        sourceId: "sharepoint_site_site_1",
      },
      {
        repeat: { every: 86_400_000 },
        jobId:
          "app_test_knowledge_source_sync_agent_1_sharepoint_sharepoint_site_site_1",
      }
    )
  })

  it("reconciles repeatable jobs for an agent", async () => {
    mockGetRepeatableJobs.mockResolvedValue([
      {
        id: "app_test_knowledge_source_sync_agent_1_sharepoint_sharepoint_site_old",
        key: "repeat:old",
      },
      {
        id: "app_test_knowledge_source_sync_agent_1_sharepoint_sharepoint_site_site_1",
        key: "repeat:site-1",
      },
    ])

    const agent: Agent = {
      _id: "agent_1",
      name: "Agent",
      aiconfig: "default",
      knowledgeSources: [
        {
          id: "sharepoint_site_site_1",
          type: AgentKnowledgeSourceType.SHAREPOINT,
          config: {
            site: { id: "site_1" },
          },
        },
        {
          id: "sharepoint_site_site_2",
          type: AgentKnowledgeSourceType.SHAREPOINT,
          config: {
            site: { id: "site_2" },
          },
        },
      ],
    }

    await reconcileAgentJobs(agent)

    expect(mockRemoveRepeatableByKey).toHaveBeenCalledWith("repeat:old")
    expect(mockRemoveJobs).toHaveBeenCalledWith(
      "app_test_knowledge_source_sync_agent_1_sharepoint_sharepoint_site_old"
    )
    expect(mockQueueAdd).toHaveBeenCalledWith(
      {
        workspaceId: "app_dev_test",
        agentId: "agent_1",
        sourceType: AgentKnowledgeSourceType.SHAREPOINT,
        sourceId: "sharepoint_site_site_2",
      },
      expect.objectContaining({
        jobId:
          "app_test_knowledge_source_sync_agent_1_sharepoint_sharepoint_site_site_2",
      })
    )
  })

  it("removes all repeatable jobs for an agent", async () => {
    mockGetRepeatableJobs.mockResolvedValue([
      {
        id: "app_test_knowledge_source_sync_agent_1_sharepoint_sharepoint_site_1",
        key: "repeat:site-1",
      },
      {
        id: "app_test_knowledge_source_sync_agent_1_sharepoint_sharepoint_site_2",
        key: "repeat:site-2",
      },
      {
        id: "app_test_knowledge_source_sync_agent_2_sharepoint_sharepoint_site_9",
        key: "repeat:other-agent",
      },
    ])

    await removeAllAgentJobs("agent_1")

    expect(mockRemoveRepeatableByKey).toHaveBeenCalledTimes(2)
    expect(mockRemoveJobs).toHaveBeenCalledTimes(2)
    expect(mockRemoveRepeatableByKey).toHaveBeenCalledWith("repeat:site-1")
    expect(mockRemoveRepeatableByKey).toHaveBeenCalledWith("repeat:site-2")
    expect(mockRemoveJobs).toHaveBeenCalledWith(
      "app_test_knowledge_source_sync_agent_1_sharepoint_sharepoint_site_1"
    )
    expect(mockRemoveJobs).toHaveBeenCalledWith(
      "app_test_knowledge_source_sync_agent_1_sharepoint_sharepoint_site_2"
    )
  })

  it("processes queued jobs by syncing one site in workspace context", async () => {
    jest.resetModules()
    const queueModule = await import("./knowledgeSourceSyncQueue")
    queueModule.init()

    const processHandler = mockQueueProcess.mock.calls[0][1]
    await processHandler({
      data: {
        workspaceId: "app_dev_test",
        agentId: "agent_1",
        sourceType: AgentKnowledgeSourceType.SHAREPOINT,
        sourceId: "sharepoint_site_site_1",
      },
    })

    expect(mockDoInWorkspaceContext).toHaveBeenCalledWith(
      "app_dev_test",
      expect.any(Function)
    )
    expect(mockSyncSharePointSourcesForAgent).toHaveBeenCalledWith("agent_1", [
      "sharepoint_site_site_1",
    ])
  })

  it("removes orphan jobs during rehydration", async () => {
    mockGetRepeatableJobs.mockResolvedValue([
      {
        id: "app_test_knowledge_source_sync_agent_deleted_sharepoint_sharepoint_site_1",
        key: "repeat:orphan",
      },
      {
        id: "app_test_knowledge_source_sync_agent_1_sharepoint_sharepoint_site_site_1",
        key: "repeat:valid",
      },
    ])
    mockWorkspaceAllDocs.mockResolvedValue({
      rows: [
        {
          doc: {
            _id: "agent_1",
            name: "Agent",
            aiconfig: "default",
            knowledgeSources: [
              {
                id: "sharepoint_site_site_1",
                type: AgentKnowledgeSourceType.SHAREPOINT,
                config: {
                  site: { id: "site_1" },
                },
              },
            ],
          } satisfies Agent,
        },
      ],
    })

    await withEnv(
      {
        SELF_HOSTED: "1",
        MULTI_TENANCY: undefined,
        FORKED_PROCESS_NAME: undefined,
      },
      () => rehydrateScheduledJobs()
    )

    expect(mockRemoveRepeatableByKey).toHaveBeenCalledWith("repeat:orphan")
    expect(mockRemoveJobs).toHaveBeenCalledWith(
      "app_test_knowledge_source_sync_agent_deleted_sharepoint_sharepoint_site_1"
    )
    expect(mockRemoveRepeatableByKey).not.toHaveBeenCalledWith("repeat:valid")
  })
})
