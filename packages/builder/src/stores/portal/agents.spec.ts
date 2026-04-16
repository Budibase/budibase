import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { get } from "svelte/store"
import {
  AgentKnowledgeSourceType,
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
      fetchAgentFiles: vi.fn(),
      uploadAgentFile: vi.fn(),
      deleteAgentFile: vi.fn(),
      syncAgentKnowledgeSources: vi.fn(),
      fetchAgentKnowledgeSourceOptions: vi.fn(),
    },
  }
})

const fetchAgents = vi.mocked(API.fetchAgents)
const fetchAgentFiles = vi.mocked(API.fetchAgentFiles)
const uploadAgentFile = vi.mocked(API.uploadAgentFile)
const deleteAgentFile = vi.mocked(API.deleteAgentFile)
const syncAgentKnowledgeSources = vi.mocked(API.syncAgentKnowledgeSources)
const fetchAgentKnowledgeSourceOptions = vi.mocked(
  API.fetchAgentKnowledgeSourceOptions
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
      knowledgeByAgentId: {},
      currentAgentId: undefined,
    })
  })

  afterEach(() => {
    store.stopAgentFilePolling()
    store.stopAgentKnowledgeSourcePolling()
    vi.useRealTimers()
  })

  it("syncAgentKnowledgeSources forwards sourceIds payload", async () => {
    syncAgentKnowledgeSources.mockResolvedValue({
      agentId: "agent_1",
      synced: 2,
      failed: 0,
      skipped: 1,
      totalDiscovered: 3,
    })

    const result = await store.syncAgentKnowledgeSources("agent_1", {
      sourceIds: ["site-1", "site-2"],
    })

    expect(syncAgentKnowledgeSources).toHaveBeenCalledWith("agent_1", {
      sourceIds: ["site-1", "site-2"],
    })
    expect(result.synced).toBe(2)
    expect(result.totalDiscovered).toBe(3)
  })

  it("fetchAgentFiles stores files by agent id", async () => {
    const files: KnowledgeBaseFile[] = [
      {
        _id: "kb_file_1",
        knowledgeSourceId: "local_upload",
        retrievalFileId: "rag_source_1",
        filename: "notes.md",
        objectStoreKey: "object/key",
        status: KnowledgeBaseFileStatus.READY,
        uploadedBy: "user_1",
      },
    ]
    fetchAgentFiles.mockResolvedValue({ files })

    const response = await store.fetchAgentFiles("agent_1")

    expect(fetchAgentFiles).toHaveBeenCalledWith("agent_1")
    expect(response.files).toHaveLength(1)
    expect(get(store.store).knowledgeByAgentId["agent_1"]?.files).toEqual(files)
  })

  it("fetchAgentKnowledgeSourceOptions forwards request", async () => {
    fetchAgentKnowledgeSourceOptions.mockResolvedValue({
      options: [{ id: "site-1", name: "Team Site", webUrl: "https://example" }],
      runs: [],
    })

    const result = await store.fetchAgentKnowledgeSourceOptions("agent_1")

    expect(fetchAgentKnowledgeSourceOptions).toHaveBeenCalledWith("agent_1")
    expect(result.options).toHaveLength(1)
    expect(
      get(store.store).knowledgeByAgentId["agent_1"]?.sourceOptions
    ).toEqual(result.options)
    expect(get(store.store).knowledgeByAgentId["agent_1"]?.sourceRuns).toEqual(
      result.runs
    )
  })

  it("startAgentFilePolling fetches while files are processing", async () => {
    vi.useFakeTimers()
    store.set({
      agents: [],
      tools: [],
      agentsLoaded: false,
      knowledgeByAgentId: {
        agent_1: {
          files: [
            {
              _id: "kb_file_1",
              knowledgeSourceId: "local_upload",
              retrievalFileId: "rag_source_1",
              filename: "notes.md",
              objectStoreKey: "object/key",
              status: KnowledgeBaseFileStatus.PROCESSING,
              uploadedBy: "user_1",
            },
          ],
          sourceOptions: [],
          sourceRuns: [],
        },
      },
      currentAgentId: undefined,
    })

    fetchAgentFiles.mockResolvedValue({
      files: [
        {
          _id: "kb_file_1",
          knowledgeSourceId: "local_upload",
          retrievalFileId: "rag_source_1",
          filename: "notes.md",
          objectStoreKey: "object/key",
          status: KnowledgeBaseFileStatus.READY,
          uploadedBy: "user_1",
        },
      ],
    })

    store.startAgentFilePolling("agent_1", 25)
    await vi.advanceTimersByTimeAsync(60)

    expect(fetchAgentFiles).toHaveBeenCalledTimes(1)
    expect(
      get(store.store).knowledgeByAgentId["agent_1"]?.files[0].status
    ).toBe(KnowledgeBaseFileStatus.READY)
  })

  it("startAgentFilePolling does not fetch when there are no processing files", async () => {
    vi.useFakeTimers()
    store.set({
      agents: [],
      tools: [],
      agentsLoaded: false,
      knowledgeByAgentId: {
        agent_1: {
          files: [
            {
              _id: "kb_file_1",
              knowledgeSourceId: "local_upload",
              retrievalFileId: "rag_source_1",
              filename: "notes.md",
              objectStoreKey: "object/key",
              status: KnowledgeBaseFileStatus.READY,
              uploadedBy: "user_1",
            },
          ],
          sourceOptions: [],
          sourceRuns: [],
        },
      },
      currentAgentId: undefined,
    })

    store.startAgentFilePolling("agent_1", 25)
    await vi.advanceTimersByTimeAsync(80)

    expect(fetchAgentFiles).not.toHaveBeenCalled()
  })

  it("startAgentKnowledgeSourcePolling polls until first source run exists", async () => {
    vi.useFakeTimers()
    store.set({
      agents: [
        {
          _id: "agent_1",
          name: "Agent 1",
          knowledgeSources: [
            {
              id: "sharepoint_source_1",
              type: AgentKnowledgeSourceType.SHAREPOINT,
              config: {
                site: {
                  id: "site-1",
                  name: "Site 1",
                  webUrl: "https://example.com/sites/1",
                },
              },
            },
          ],
        } as Agent,
      ],
      tools: [],
      agentsLoaded: false,
      knowledgeByAgentId: {
        agent_1: {
          files: [],
          sourceOptions: [],
          sourceRuns: [],
        },
      },
      currentAgentId: "agent_1",
    })

    fetchAgentKnowledgeSourceOptions
      .mockResolvedValueOnce({
        options: [],
        runs: [],
      })
      .mockResolvedValueOnce({
        options: [],
        runs: [
          {
            sourceId: "sharepoint_source_1",
            lastRunAt: "2026-04-16T00:00:00.000Z",
            synced: 0,
            failed: 0,
            skipped: 0,
            unsupported: 0,
            totalDiscovered: 0,
            status: "success",
          },
        ],
      })

    fetchAgentFiles.mockResolvedValue({ files: [] })

    store.startAgentKnowledgeSourcePolling("agent_1", 25)
    await vi.advanceTimersByTimeAsync(30)
    await vi.advanceTimersByTimeAsync(30)
    await vi.advanceTimersByTimeAsync(30)

    expect(fetchAgentKnowledgeSourceOptions).toHaveBeenCalledTimes(2)
    expect(fetchAgentFiles).toHaveBeenCalledTimes(2)
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
    uploadAgentFile.mockResolvedValue(uploadResponse)
    fetchAgents.mockResolvedValue({ agents })

    await store.uploadAgentFile("agent_1", {} as File)

    expect(uploadAgentFile).toHaveBeenCalledWith("agent_1", expect.anything())
    expect(fetchAgents).toHaveBeenCalledTimes(1)
    expect(get(store.store).agents).toEqual(agents)
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

    await store.deleteAgentFile("agent_1", "file_1")

    expect(deleteAgentFile).toHaveBeenCalledWith("agent_1", "file_1")
    expect(fetchAgents).not.toHaveBeenCalled()
  })
})
