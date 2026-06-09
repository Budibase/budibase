import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { get } from "svelte/store"
import {
  KnowledgeBaseFileSourceType,
  KnowledgeBaseFileStatus,
  type Agent,
  type AgentFileUploadResponse,
  type KnowledgeBaseFile,
} from "@budibase/types"
import { API } from "@/api"
import { AgentsStore } from "./agents"

vi.mock("@/api", () => {
  return {
    API: {
      fetchAgents: vi.fn(),
      fetchAgentKnowledge: vi.fn(),
      uploadOperationFile: vi.fn(),
      deleteOperationFile: vi.fn(),
      syncOperationKnowledgeSources: vi.fn(),
      resetOperationKnowledgeBaseStore: vi.fn(),
    },
  }
})

const fetchAgents = vi.mocked(API.fetchAgents)
const fetchAgentKnowledge = vi.mocked(API.fetchAgentKnowledge)
const uploadOperationFile = vi.mocked(API.uploadOperationFile)
const deleteOperationFile = vi.mocked(API.deleteOperationFile)
const syncOperationKnowledgeSources = vi.mocked(
  API.syncOperationKnowledgeSources
)
const resetOperationKnowledgeBaseStore = vi.mocked(
  API.resetOperationKnowledgeBaseStore
)

describe("agentsStore sharepoint and file syncing", () => {
  let store: AgentsStore

  beforeEach(() => {
    vi.clearAllMocks()
    store = new AgentsStore()
    store.set({
      agents: [],
      tools: [],
      agentsLoaded: false,
      knowledgeByOperation: {},
      currentAgentId: undefined,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("syncOperationKnowledgeSources forwards sourceIds payload", async () => {
    syncOperationKnowledgeSources.mockResolvedValue({
      agentId: "agent_1",
      synced: 2,
      failed: 0,
      alreadySynced: 1,
      deleted: 0,
      unsupported: 0,
      totalDiscovered: 3,
    })

    const result = await store.syncOperationKnowledgeSources(
      "agent_1",
      "operation_1",
      "site-1"
    )

    expect(syncOperationKnowledgeSources).toHaveBeenCalledWith(
      "agent_1",
      "operation_1",
      "site-1"
    )
    expect(result.synced).toBe(2)
    expect(result.totalDiscovered).toBe(3)
  })

  it("fetchAgentKnowledge stores all operation knowledge", async () => {
    const files: KnowledgeBaseFile[] = [
      {
        _id: "kb_file_1",
        knowledgeBaseId: "kb_1",
        source: {
          type: KnowledgeBaseFileSourceType.SHAREPOINT,
          knowledgeSourceId: "source-1",
          siteId: "site-1",
          driveId: "drive-1",
          itemId: "item-1",
          path: "folder-1/notes.md",
        },
        ragSourceId: "rag_source_1",
        filename: "notes.md",
        objectStoreKey: "object/key",
        status: KnowledgeBaseFileStatus.READY,
        uploadedBy: "user_1",
      },
    ]
    fetchAgentKnowledge.mockResolvedValue({
      operations: {
        operation_1: { files, sharePointSources: [] },
        operation_2: { files: [], sharePointSources: [] },
      },
    })

    const response = await store.fetchAgentKnowledge("agent_1")

    expect(fetchAgentKnowledge).toHaveBeenCalledWith("agent_1")
    expect(response.operations.operation_1.files).toHaveLength(1)
    expect(
      get(store.store).knowledgeByOperation["agent_1:operation_1"]
    ).toEqual({ files, sharePointSources: [] })
    expect(
      get(store.store).knowledgeByOperation["agent_1:operation_2"]
    ).toEqual({ files: [], sharePointSources: [] })
  })

  it("getOperationKnowledge reads from the cached index", async () => {
    fetchAgentKnowledge.mockResolvedValue({
      operations: {
        operation_1: { files: [], sharePointSources: [] },
      },
    })

    await store.fetchAgentKnowledge("agent_1")

    expect(store.getOperationKnowledge("agent_1", "operation_1")).toEqual({
      files: [],
      sharePointSources: [],
    })
  })
})

describe("AgentsStore file operations", () => {
  let store: AgentsStore

  beforeEach(() => {
    vi.clearAllMocks()
    store = new AgentsStore()
  })

  it("refreshes agents after uploading a file", async () => {
    const agents: Agent[] = [
      {
        _id: "agent_1",
        _rev: "2-rev",
        name: "Support bot",
      } as Agent,
    ]
    const uploadResponse: AgentFileUploadResponse = {
      file: {
        _id: "kb_file_1",
      } as AgentFileUploadResponse["file"],
    }
    uploadOperationFile.mockResolvedValue(uploadResponse)
    fetchAgents.mockResolvedValue({ agents })

    await store.uploadOperationFile("agent_1", "operation_1", {} as File)

    expect(uploadOperationFile).toHaveBeenCalledWith(
      "agent_1",
      "operation_1",
      expect.anything()
    )
    expect(fetchAgents).toHaveBeenCalledTimes(1)
    expect(get(store.store).agents).toEqual(agents)
    expect(
      get(store.store).knowledgeByOperation["agent_1:operation_1"]?.files
    ).toEqual([uploadResponse.file])
  })

  it("does not refresh agents after deleting a file", async () => {
    const agents: Agent[] = [
      {
        _id: "agent_1",
        _rev: "3-rev",
        name: "Support bot",
      } as Agent,
    ]

    fetchAgents.mockResolvedValue({ agents })

    await store.deleteOperationFile("agent_1", "operation_1", "file_1")

    expect(deleteOperationFile).toHaveBeenCalledWith(
      "agent_1",
      "operation_1",
      "file_1"
    )
    expect(fetchAgents).not.toHaveBeenCalled()
  })

  it("calls resetOperationKnowledgeBaseStore and re-fetches knowledge on reset", async () => {
    resetOperationKnowledgeBaseStore.mockResolvedValue(undefined)
    fetchAgentKnowledge.mockResolvedValue({
      operations: {
        operation_1: { files: [], sharePointSources: [] },
      },
    })

    await store.resetOperationKnowledgeBaseStore("agent_1", "operation_1")

    expect(resetOperationKnowledgeBaseStore).toHaveBeenCalledWith(
      "agent_1",
      "operation_1"
    )
    expect(fetchAgentKnowledge).toHaveBeenCalledWith("agent_1")
  })
})
