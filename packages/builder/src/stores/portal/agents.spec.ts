import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { get } from "svelte/store"
import {
  KnowledgeBaseFileSourceType,
  KnowledgeBaseFileStatus,
  AgentKnowledgeSourceSyncRunStatus,
  ToolType,
  type Agent,
  type AgentFileUploadResponse,
  type KnowledgeBaseFile,
  type ToolMetadata,
} from "@budibase/types"
import { API } from "@/api"
import { AgentsStore } from "./agents"

vi.mock("@/api", () => {
  return {
    API: {
      fetchAgents: vi.fn(),
      fetchTools: vi.fn(),
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
const fetchTools = vi.mocked(API.fetchTools)
const fetchAgentKnowledge = vi.mocked(API.fetchAgentKnowledge)
const uploadOperationFile = vi.mocked(API.uploadOperationFile)
const deleteOperationFile = vi.mocked(API.deleteOperationFile)
const syncOperationKnowledgeSources = vi.mocked(
  API.syncOperationKnowledgeSources
)
const resetOperationKnowledgeBaseStore = vi.mocked(
  API.resetOperationKnowledgeBaseStore
)

const knowledgeConfiguration = { knowledgeSearchConfigured: true }

const createEmptyState = () => ({
  agents: [] as Agent[],
  tools: [],
  toolsLoading: false,
  toolsLoaded: false,
  toolsLoadFailed: false,
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
      sourceId: "site-1",
      status: AgentKnowledgeSourceSyncRunStatus.QUEUED,
    })
    fetchAgentKnowledge.mockResolvedValue({
      operations: {
        operation_1: { files: [], sharePointSources: [] },
      },
      configuration: knowledgeConfiguration,
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
    expect(result.status).toBe(AgentKnowledgeSourceSyncRunStatus.QUEUED)
  })

  it("fetchAgentKnowledge stores all operation knowledge", async () => {
    const files: KnowledgeBaseFile[] = [
      {
        _id: "kb_file_1",
        knowledgeBaseId: "kb_1",
        source: {
          type: KnowledgeBaseFileSourceType.SHAREPOINT_SITE,
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
      configuration: knowledgeConfiguration,
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
      configuration: knowledgeConfiguration,
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
      configuration: knowledgeConfiguration,
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
      configuration: knowledgeConfiguration,
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
      configuration: knowledgeConfiguration,
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

  it("polls while a SharePoint sync is queued", async () => {
    vi.useFakeTimers()
    fetchAgentKnowledge.mockResolvedValue({
      operations: {
        operation_1: {
          files: [],
          sharePointSources: [
            {
              sourceId: "source-1",
              runStatus: AgentKnowledgeSourceSyncRunStatus.QUEUED,
              syncedCount: 0,
              failedCount: 0,
              processingCount: 0,
              totalCount: 0,
            },
          ],
        },
      },
      configuration: knowledgeConfiguration,
    })

    await store.fetchAgentKnowledge("agent_1")
    fetchAgentKnowledge.mockClear()
    await vi.advanceTimersByTimeAsync(1000)

    expect(fetchAgentKnowledge).toHaveBeenCalledWith("agent_1")
  })

  it("does not poll when a SharePoint source has no sync state", async () => {
    vi.useFakeTimers()
    fetchAgentKnowledge.mockResolvedValue({
      operations: {
        operation_1: {
          files: [],
          sharePointSources: [
            {
              sourceId: "source-1",
              syncedCount: 0,
              failedCount: 0,
              processingCount: 0,
              totalCount: 0,
            },
          ],
        },
      },
      configuration: knowledgeConfiguration,
    })

    await store.fetchAgentKnowledge("agent_1")
    fetchAgentKnowledge.mockClear()
    await vi.advanceTimersByTimeAsync(1000)

    expect(fetchAgentKnowledge).not.toHaveBeenCalled()
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
      configuration: knowledgeConfiguration,
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
      configuration: knowledgeConfiguration,
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
      configuration: knowledgeConfiguration,
    })

    await store.resetOperationKnowledgeBaseStore("agent_1", "operation_1")

    expect(resetOperationKnowledgeBaseStore).toHaveBeenCalledWith(
      "agent_1",
      "operation_1"
    )
    expect(fetchAgentKnowledge).toHaveBeenCalledWith("agent_1")
  })
})

describe("agentsStore fetchTools", () => {
  let store: AgentsStore

  const createTool = (name: string): ToolMetadata => ({
    name,
    sourceType: ToolType.INTERNAL_TABLE,
    executionPolicy: { mode: "admin" },
  })

  beforeEach(() => {
    vi.clearAllMocks()
    fetchAgents.mockResolvedValue({ agents: [] })
    store = new AgentsStore()
    store.set(createEmptyState())
  })

  it("ignores stale tool responses when init runs during fetch", async () => {
    let resolveFirst: ((tools: ToolMetadata[]) => void) | undefined
    const firstRequest = new Promise<ToolMetadata[]>(resolve => {
      resolveFirst = resolve
    })

    fetchTools
      .mockImplementationOnce(() => firstRequest)
      .mockResolvedValueOnce([createTool("fresh-tool")])

    const staleFetch = store.fetchTools()
    await store.init()
    const freshFetch = store.fetchTools()

    resolveFirst?.([createTool("stale-tool")])
    await staleFetch
    await freshFetch

    const state = get(store.store)
    expect(state.tools).toEqual([createTool("fresh-tool")])
    expect(state.toolsLoaded).toBe(true)
    expect(state.toolsLoading).toBe(false)
  })

  it("does not apply stale tools when init runs without a follow-up fetch", async () => {
    let resolveFirst: ((tools: ToolMetadata[]) => void) | undefined
    const firstRequest = new Promise<ToolMetadata[]>(resolve => {
      resolveFirst = resolve
    })

    fetchTools.mockImplementationOnce(() => firstRequest)

    const staleFetch = store.fetchTools()
    await store.init()

    resolveFirst?.([createTool("stale-tool")])
    await staleFetch

    const state = get(store.store)
    expect(state.tools).toEqual([])
    expect(state.toolsLoaded).toBe(false)
    expect(state.toolsLoading).toBe(false)
  })

  it("stops retrying after fetchTools fails", async () => {
    fetchTools.mockRejectedValue(new Error("network error"))

    await store.fetchTools()

    expect(fetchTools).toHaveBeenCalledTimes(1)
    expect(get(store.store).toolsLoadFailed).toBe(true)
    expect(get(store.store).toolsLoading).toBe(false)
  })

  it("clears tools when init runs on workspace change", async () => {
    fetchTools.mockResolvedValue([createTool("workspace-tool")])

    await store.fetchTools()
    await store.init()

    expect(fetchTools).toHaveBeenCalledTimes(1)
    expect(get(store.store).tools).toEqual([])
    expect(get(store.store).toolsLoaded).toBe(false)
  })
})
