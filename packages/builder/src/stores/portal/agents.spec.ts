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
      updateAgent: vi.fn(),
      fetchAgentKnowledge: vi.fn(),
      uploadOperationFile: vi.fn(),
      deleteOperationFile: vi.fn(),
      syncOperationKnowledgeSources: vi.fn(),
      resetOperationKnowledgeBaseStore: vi.fn(),
    },
  }
})

const fetchAgents = vi.mocked(API.fetchAgents)
const updateAgent = vi.mocked(API.updateAgent)
const fetchAgentKnowledge = vi.mocked(API.fetchAgentKnowledge)
const uploadOperationFile = vi.mocked(API.uploadOperationFile)
const deleteOperationFile = vi.mocked(API.deleteOperationFile)
const syncOperationKnowledgeSources = vi.mocked(
  API.syncOperationKnowledgeSources
)
const resetOperationKnowledgeBaseStore = vi.mocked(
  API.resetOperationKnowledgeBaseStore
)

const createEmptyState = () => ({
  agents: [] as Agent[],
  tools: [],
  agentsLoaded: false,
  knowledgeByOperation: {},
  knowledgeUploadByOperation: {},
  knowledgeLoadingByOperation: {},
  currentAgentId: undefined as string | undefined,
})

describe("agentsStore sharepoint and file syncing", () => {
  let store: AgentsStore

  beforeEach(() => {
    vi.clearAllMocks()
    store = new AgentsStore()
    store.set(createEmptyState())
  })

  afterEach(() => {
    vi.useRealTimers()
    store.stopOperationKnowledgePolling()
  })

  it("syncOperationKnowledgeSources refreshes knowledge after sync", async () => {
    syncOperationKnowledgeSources.mockResolvedValue({
      agentId: "agent_1",
      synced: 2,
      failed: 0,
      alreadySynced: 1,
      deleted: 0,
      unsupported: 0,
      totalDiscovered: 3,
    })
    fetchAgentKnowledge.mockResolvedValue({
      operations: {
        operation_1: { files: [], sharePointSources: [] },
      },
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
    expect(fetchAgentKnowledge).toHaveBeenCalledWith("agent_1")
    expect(result.synced).toBe(2)
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

  it("fetchAgentKnowledge clears stale operation knowledge for the agent before storing", async () => {
    store.set({
      ...createEmptyState(),
      knowledgeByOperation: {
        "agent_1:operation_old": {
          files: [
            {
              _id: "stale_file",
            } as KnowledgeBaseFile,
          ],
          sharePointSources: [],
        },
        "agent_2:operation_keep": {
          files: [],
          sharePointSources: [],
        },
      },
    })
    fetchAgentKnowledge.mockResolvedValue({
      operations: {
        operation_1: { files: [], sharePointSources: [] },
      },
    })

    await store.fetchAgentKnowledge("agent_1")

    expect(get(store.store).knowledgeByOperation).toEqual({
      "agent_1:operation_1": { files: [], sharePointSources: [] },
      "agent_2:operation_keep": { files: [], sharePointSources: [] },
    })
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

  it("ensureOperationKnowledgeLoaded fetches when cache is empty", async () => {
    fetchAgentKnowledge.mockResolvedValue({
      operations: {
        operation_1: { files: [], sharePointSources: [] },
      },
    })

    await store.ensureOperationKnowledgeLoaded("agent_1", "operation_1")

    expect(fetchAgentKnowledge).toHaveBeenCalledWith("agent_1")
    expect(store.isOperationKnowledgeLoading("agent_1", "operation_1")).toBe(
      false
    )
  })

  it("ensureOperationKnowledgeLoaded restarts polling when cache exists", async () => {
    vi.useFakeTimers()
    const processingFile = {
      _id: "kb_file_1",
      status: KnowledgeBaseFileStatus.PROCESSING,
    } as KnowledgeBaseFile
    fetchAgentKnowledge.mockResolvedValue({
      operations: {
        operation_1: { files: [processingFile], sharePointSources: [] },
      },
    })

    await store.fetchAgentKnowledge("agent_1")
    expect(fetchAgentKnowledge).toHaveBeenCalledTimes(1)

    store.stopOperationKnowledgePolling()
    fetchAgentKnowledge.mockClear()

    await store.ensureOperationKnowledgeLoaded("agent_1", "operation_1")
    expect(fetchAgentKnowledge).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1000)
    expect(fetchAgentKnowledge).toHaveBeenCalledTimes(1)
  })
})

describe("AgentsStore file operations", () => {
  let store: AgentsStore

  beforeEach(() => {
    vi.clearAllMocks()
    store = new AgentsStore()
  })

  afterEach(() => {
    store.stopOperationKnowledgePolling()
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

  it("refreshes knowledge after removing a file", async () => {
    fetchAgents.mockResolvedValue({ agents: [] })
    fetchAgentKnowledge.mockResolvedValue({
      operations: {
        operation_1: { files: [], sharePointSources: [] },
      },
    })

    await store.removeOperationKnowledgeFile("agent_1", "operation_1", "file_1")

    expect(deleteOperationFile).toHaveBeenCalledWith(
      "agent_1",
      "operation_1",
      "file_1"
    )
    expect(fetchAgents).toHaveBeenCalledTimes(1)
    expect(fetchAgentKnowledge).toHaveBeenCalledWith("agent_1")
  })

  it("uploadOperationFiles tracks pending uploads and refreshes knowledge", async () => {
    const uploadedFile = {
      _id: "kb_file_1",
      filename: "notes.txt",
      status: KnowledgeBaseFileStatus.PROCESSING,
    } as AgentFileUploadResponse["file"]
    uploadOperationFile.mockResolvedValue({
      file: uploadedFile,
    })
    fetchAgents.mockResolvedValue({ agents: [] })
    fetchAgentKnowledge.mockResolvedValue({
      operations: {
        operation_1: { files: [uploadedFile], sharePointSources: [] },
      },
    })

    const file = new File(["hello"], "notes.txt", { type: "text/plain" })
    const result = await store.uploadOperationFiles("agent_1", "operation_1", [
      file,
    ])

    expect(result.successfulUploads).toBe(1)
    expect(
      store.getOperationKnowledge("agent_1", "operation_1")?.files
    ).toEqual([uploadedFile])
    expect(fetchAgentKnowledge).toHaveBeenCalledWith("agent_1")
    expect(store.getOperationUploadState("agent_1", "operation_1")).toEqual({
      pendingUploads: [],
      uploading: false,
      progress: "",
    })
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

describe("AgentsStore operation updates", () => {
  let store: AgentsStore

  beforeEach(() => {
    vi.clearAllMocks()
    store = new AgentsStore()
  })

  it("updates allowKnowledgeSourceDownload through the store", async () => {
    const existingAgent = {
      _id: "agent_1",
      _rev: "1-rev",
      name: "Support bot",
      operations: [
        {
          id: "operation_1",
          name: "Main operation",
          live: false,
          allowKnowledgeSourceDownload: true,
        },
        {
          id: "operation_2",
          name: "Secondary operation",
          live: false,
          allowKnowledgeSourceDownload: true,
        },
      ],
    } as Agent
    const updatedAgent = {
      ...existingAgent,
      _rev: "2-rev",
      operations: [
        {
          ...existingAgent.operations![0],
          allowKnowledgeSourceDownload: false,
        },
        existingAgent.operations![1],
      ],
    } as Agent

    store.set({
      ...createEmptyState(),
      agents: [existingAgent],
      agentsLoaded: true,
      currentAgentId: existingAgent._id,
    })
    updateAgent.mockResolvedValue(updatedAgent)

    const result = await store.updateOperationAllowKnowledgeSourceDownload(
      "agent_1",
      "operation_1",
      false
    )

    expect(updateAgent).toHaveBeenCalledWith({
      ...existingAgent,
      operations: [
        {
          ...existingAgent.operations![0],
          allowKnowledgeSourceDownload: false,
        },
        existingAgent.operations![1],
      ],
    })
    expect(result).toEqual(updatedAgent)
    expect(get(store.store).agents).toEqual([updatedAgent])
  })
})
