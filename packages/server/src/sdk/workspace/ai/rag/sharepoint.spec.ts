const mockContextGetOrThrowWorkspaceId = jest.fn()
const mockContextGetWorkspaceDb = jest.fn()
const mockGenerateSyncStateId = jest.fn()

const mockAgentsGetOrThrow = jest.fn()
const mockKnowledgeBaseListFiles = jest.fn()
const mockKnowledgeBaseUploadFile = jest.fn()
const mockGetSharePointBearerToken = jest.fn()
const mockEnsureKnowledgeBaseForAgent = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getOrThrowWorkspaceId: () => mockContextGetOrThrowWorkspaceId(),
      getWorkspaceDB: () => mockContextGetWorkspaceDb(),
    },
    docIds: {
      ...actual.docIds,
      generateAgentKnowledgeSourceSyncStateID: (...args: any[]) =>
        mockGenerateSyncStateId(...args),
    },
  }
})

jest.mock("..", () => ({
  agents: {
    getOrThrow: (...args: any[]) => mockAgentsGetOrThrow(...args),
  },
  knowledgeBase: {
    listKnowledgeBaseFiles: (...args: any[]) =>
      mockKnowledgeBaseListFiles(...args),
    uploadKnowledgeBaseFile: (...args: any[]) =>
      mockKnowledgeBaseUploadFile(...args),
  },
}))

jest.mock("../sharepoint", () => {
  const actual = jest.requireActual("../sharepoint")
  return {
    ...actual,
    getSharePointBearerToken: (...args: any[]) =>
      mockGetSharePointBearerToken(...args),
  }
})

jest.mock("./files", () => {
  return {
    ensureKnowledgeBaseForAgent: (...args: any[]) =>
      mockEnsureKnowledgeBaseForAgent(...args),
  }
})

import {
  AgentKnowledgeSourceType,
  KnowledgeBaseFileSourceType,
  KnowledgeBaseFileStatus,
  KnowledgeBaseType,
  type Agent,
  type KnowledgeBaseFile,
} from "@budibase/types"
import { syncSharePointSourcesForAgent } from "./sharepoint"

const toArrayBuffer = (value: string) => {
  const buffer = Buffer.from(value)
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  )
}

describe("rag/sharepoint sync deduplication", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockContextGetOrThrowWorkspaceId.mockReturnValue("workspace_1")
    mockContextGetWorkspaceDb.mockReturnValue({
      tryGet: jest.fn().mockResolvedValue(undefined),
      put: jest.fn().mockResolvedValue(undefined),
    })
    mockGenerateSyncStateId.mockReturnValue("sync_state_1")
    mockGetSharePointBearerToken.mockResolvedValue("Bearer token")
    mockEnsureKnowledgeBaseForAgent.mockResolvedValue({
      _id: "kb_1",
      name: "KB 1",
      type: KnowledgeBaseType.GEMINI,
      config: {
        googleFileStoreId: "store_1",
      },
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("does not skip a new file when itemId matches an existing file from another drive", async () => {
    const sourceId = "sharepoint_source_1"
    const siteId = "site-1"

    mockAgentsGetOrThrow.mockResolvedValue({
      _id: "agent_1",
      knowledgeSources: [
        {
          id: sourceId,
          type: AgentKnowledgeSourceType.SHAREPOINT,
          config: {
            site: {
              id: siteId,
            },
          },
        },
      ],
    } as Agent)

    mockKnowledgeBaseListFiles.mockResolvedValue([
      {
        _id: "existing_1",
        knowledgeBaseId: "kb_1",
        source: {
          type: KnowledgeBaseFileSourceType.SHAREPOINT,
          knowledgeSourceId: sourceId,
          siteId,
          driveId: "drive-a",
          itemId: "item-1",
          path: "existing.txt",
        },
        filename: "existing.txt",
        objectStoreKey: "key-existing",
        ragSourceId: "rag-existing",
        status: KnowledgeBaseFileStatus.READY,
        uploadedBy: "sharepoint",
      } satisfies KnowledgeBaseFile,
    ])

    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockImplementation(async input => {
        const url = input.toString()

        if (url.includes(`/sites/${encodeURIComponent(siteId)}/drives`)) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              value: [{ id: "drive-b" }],
            }),
          } as Response
        }

        if (url.includes("/drives/drive-b/root/children")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              value: [
                {
                  id: "item-1",
                  name: "new.txt",
                  file: { mimeType: "text/plain" },
                },
              ],
            }),
          } as Response
        }

        if (url.includes("/drives/drive-b/items/item-1/content")) {
          return {
            ok: true,
            status: 200,
            arrayBuffer: async () => toArrayBuffer("new content"),
          } as Response
        }

        throw new Error(`Unexpected fetch URL: ${url}`)
      })

    const result = await syncSharePointSourcesForAgent("agent_1", sourceId)

    expect(fetchMock).toHaveBeenCalled()
    expect(mockKnowledgeBaseUploadFile).toHaveBeenCalledTimes(1)
    expect(mockKnowledgeBaseUploadFile).toHaveBeenCalledWith(
      expect.objectContaining({
        knowledgeBaseId: "kb_1",
        source: {
          type: KnowledgeBaseFileSourceType.SHAREPOINT,
          knowledgeSourceId: sourceId,
          siteId,
          driveId: "drive-b",
          itemId: "item-1",
          path: "new.txt",
        },
        filename: "new.txt",
      })
    )
    expect(result).toMatchObject({
      agentId: "agent_1",
      synced: 1,
      alreadySynced: 0,
      failed: 0,
      unsupported: 0,
      totalDiscovered: 1,
    })
  })
})
