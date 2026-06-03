const mockContextGetOrThrowWorkspaceId = jest.fn()
const mockContextGetWorkspaceDb = jest.fn()
const mockGenerateSyncStateId = jest.fn()
const mockDoWithLock = jest.fn()

const mockAgentsGetOrThrow = jest.fn()
const mockKnowledgeBaseListFiles = jest.fn()
const mockKnowledgeBaseUploadFile = jest.fn()
const mockRetryKnowledgeBaseFileIngestion = jest.fn()
const mockGetSharePointBearerToken = jest.fn()
const mockEnsureKnowledgeBaseForAgent = jest.fn()
const mockDeleteFileForAgent = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getOrThrowWorkspaceId: () => mockContextGetOrThrowWorkspaceId(),
      getWorkspaceDB: () => mockContextGetWorkspaceDb(),
    },
    locks: {
      ...actual.locks,
      doWithLock: (...args: any[]) => mockDoWithLock(...args),
    },
    docIds: {
      ...actual.docIds,
      generateAgentKnowledgeSourceSyncStateID: (...args: any[]) =>
        mockGenerateSyncStateId(...args),
    },
  }
})

jest.mock("../../../index", () => ({
  agents: {
    getOrThrow: (...args: any[]) => mockAgentsGetOrThrow(...args),
  },
  knowledgeBase: {
    listKnowledgeBaseFiles: (...args: any[]) =>
      mockKnowledgeBaseListFiles(...args),
    uploadKnowledgeBaseFile: (...args: any[]) =>
      mockKnowledgeBaseUploadFile(...args),
    retryKnowledgeBaseFileIngestion: (...args: any[]) =>
      mockRetryKnowledgeBaseFileIngestion(...args),
  },
}))

jest.mock("../../../knowledgeSources/sharepoint", () => {
  const actual = jest.requireActual("../../../knowledgeSources/sharepoint")
  return {
    ...actual,
    getSharePointBearerToken: (...args: any[]) =>
      mockGetSharePointBearerToken(...args),
  }
})

jest.mock("../../files", () => {
  return {
    ensureKnowledgeBaseForAgent: (...args: any[]) =>
      mockEnsureKnowledgeBaseForAgent(...args),
    deleteFileForAgent: (...args: any[]) => mockDeleteFileForAgent(...args),
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

const makeSharePointAgent = (
  sourceId: string,
  siteId: string,
  patterns?: string[],
  datasourceId = "datasource_1",
  authConfigId = "auth_1"
): Agent =>
  ({
    _id: "agent_1",
    knowledgeSources: [
      {
        id: sourceId,
        type: AgentKnowledgeSourceType.SHAREPOINT,
        config: {
          datasourceId,
          authConfigId,
          site: { id: siteId },
          ...(patterns ? { filters: { patterns } } : {}),
        },
      },
    ],
  }) as Agent

const makeSharePointFile = ({
  id,
  sourceId,
  siteId,
  driveId,
  itemId,
  path,
  status = KnowledgeBaseFileStatus.READY,
  etag,
  lastModifiedAt,
  remoteSize,
}: {
  id: string
  sourceId: string
  siteId: string
  driveId: string
  itemId: string
  path: string
  status?: KnowledgeBaseFileStatus
  etag?: string
  lastModifiedAt?: string
  remoteSize?: number
}): KnowledgeBaseFile =>
  ({
    _id: id,
    knowledgeBaseId: "kb_1",
    source: {
      type: KnowledgeBaseFileSourceType.SHAREPOINT,
      knowledgeSourceId: sourceId,
      siteId,
      driveId,
      itemId,
      path,
      externalId: `${siteId}:${driveId}:${itemId}`,
      ...(etag ? { etag } : {}),
      ...(lastModifiedAt ? { lastModifiedAt } : {}),
      ...(remoteSize !== undefined ? { remoteSize } : {}),
    },
    filename: "file.txt",
    objectStoreKey: `key-${id}`,
    ragSourceId: `rag-${id}`,
    status,
    uploadedBy: "sharepoint",
  }) satisfies KnowledgeBaseFile

const createFetchMock = (
  handlers: Array<{
    match: string
    response: Response
  }>
) =>
  jest.spyOn(globalThis, "fetch").mockImplementation(async input => {
    const url = input.toString()
    const handler = handlers.find(entry => url.includes(entry.match))
    if (handler) {
      return handler.response
    }
    throw new Error(`Unexpected fetch URL: ${url}`)
  })

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
    mockDoWithLock.mockImplementation(
      async (_options: any, handler: () => Promise<any>) => ({
        result: await handler(),
      })
    )
    mockEnsureKnowledgeBaseForAgent.mockResolvedValue({
      _id: "kb_1",
      name: "KB 1",
      type: KnowledgeBaseType.GEMINI,
      config: {
        googleFileStoreId: "store_1",
      },
    })
    mockDeleteFileForAgent.mockResolvedValue(undefined)
    mockRetryKnowledgeBaseFileIngestion.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("does not skip a new file when itemId matches an existing file from another drive", async () => {
    const sourceId = "sharepoint_source_1"
    const siteId = "site-1"

    mockAgentsGetOrThrow.mockResolvedValue(
      makeSharePointAgent(sourceId, siteId)
    )

    mockKnowledgeBaseListFiles.mockResolvedValue([
      makeSharePointFile({
        id: "existing_1",
        sourceId,
        siteId,
        driveId: "drive-a",
        itemId: "item-1",
        path: "existing.txt",
      }),
    ])

    const fetchMock = createFetchMock([
      {
        match: `/sites/${encodeURIComponent(siteId)}/drives`,
        response: {
          ok: true,
          status: 200,
          json: async () => ({
            value: [{ id: "drive-b" }],
          }),
        } as Response,
      },
      {
        match: "/drives/drive-b/root/children",
        response: {
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
        } as Response,
      },
      {
        match: "/drives/drive-b/items/item-1/content",
        response: {
          ok: true,
          status: 200,
          arrayBuffer: async () => toArrayBuffer("new content"),
        } as Response,
      },
    ])

    const result = await syncSharePointSourcesForAgent("agent_1", sourceId)

    expect(fetchMock).toHaveBeenCalled()
    expect(mockKnowledgeBaseUploadFile).toHaveBeenCalledTimes(1)
    expect(mockKnowledgeBaseUploadFile).toHaveBeenCalledWith(
      expect.objectContaining({
        knowledgeBaseId: "kb_1",
        source: expect.objectContaining({
          type: KnowledgeBaseFileSourceType.SHAREPOINT,
          knowledgeSourceId: sourceId,
          siteId,
          driveId: "drive-b",
          itemId: "item-1",
          path: "new.txt",
          externalId: `${siteId}:drive-b:item-1`,
        }),
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
  it("deletes existing files that no longer match source filters", async () => {
    const sourceId = "sharepoint_source_1"
    const siteId = "site-1"

    mockAgentsGetOrThrow.mockResolvedValue(
      makeSharePointAgent(sourceId, siteId, ["!**", "allowed/**"])
    )

    mockKnowledgeBaseListFiles.mockResolvedValue([
      makeSharePointFile({
        id: "existing_filtered_out",
        sourceId,
        siteId,
        driveId: "drive-a",
        itemId: "item-1",
        path: "blocked/file.txt",
      }),
    ])

    const fetchMock = createFetchMock([
      {
        match: `/sites/${encodeURIComponent(siteId)}/drives`,
        response: {
          ok: true,
          status: 200,
          json: async () => ({
            value: [],
          }),
        } as Response,
      },
    ])

    const result = await syncSharePointSourcesForAgent("agent_1", sourceId)

    expect(fetchMock).toHaveBeenCalled()
    expect(mockDeleteFileForAgent).toHaveBeenCalledTimes(1)
    expect(mockDeleteFileForAgent).toHaveBeenCalledWith(
      "agent_1",
      "existing_filtered_out"
    )
    expect(mockKnowledgeBaseUploadFile).not.toHaveBeenCalled()
    expect(result).toMatchObject({
      agentId: "agent_1",
      synced: 0,
      alreadySynced: 0,
      deleted: 1,
      failed: 0,
      unsupported: 0,
      totalDiscovered: 0,
    })
  })

  it("does not inflate already synced count with filtered-out files", async () => {
    const sourceId = "sharepoint_source_1"
    const siteId = "site-1"

    mockAgentsGetOrThrow.mockResolvedValue(
      makeSharePointAgent(sourceId, siteId, ["keep/**"])
    )

    mockKnowledgeBaseListFiles.mockResolvedValue([
      makeSharePointFile({
        id: "existing_keep",
        sourceId,
        siteId,
        driveId: "drive-a",
        itemId: "item-keep",
        path: "keep/file.txt",
      }),
      makeSharePointFile({
        id: "existing_drop",
        sourceId,
        siteId,
        driveId: "drive-a",
        itemId: "item-drop",
        path: "drop/file.txt",
      }),
    ])

    const fetchMock = createFetchMock([
      {
        match: `/sites/${encodeURIComponent(siteId)}/drives`,
        response: {
          ok: true,
          status: 200,
          json: async () => ({
            value: [{ id: "drive-a" }],
          }),
        } as Response,
      },
      {
        match: "/drives/drive-a/root/children",
        response: {
          ok: true,
          status: 200,
          json: async () => ({
            value: [
              {
                id: "folder-keep",
                name: "keep",
                folder: {},
              },
              {
                id: "folder-drop",
                name: "drop",
                folder: {},
              },
            ],
          }),
        } as Response,
      },
      {
        match: "/drives/drive-a/items/folder-keep/children",
        response: {
          ok: true,
          status: 200,
          json: async () => ({
            value: [
              {
                id: "item-keep",
                name: "file.txt",
                file: { mimeType: "text/plain" },
              },
            ],
          }),
        } as Response,
      },
      {
        match: "/drives/drive-a/items/folder-drop/children",
        response: {
          ok: true,
          status: 200,
          json: async () => ({
            value: [
              {
                id: "item-drop",
                name: "file.txt",
                file: { mimeType: "text/plain" },
              },
            ],
          }),
        } as Response,
      },
      {
        match: "/drives/drive-a/items/item-1/content",
        response: {
          ok: true,
          status: 200,
          arrayBuffer: async () => toArrayBuffer("legacy content"),
        } as Response,
      },
    ])

    const result = await syncSharePointSourcesForAgent("agent_1", sourceId)

    expect(fetchMock).toHaveBeenCalled()
    expect(result).toMatchObject({
      synced: 0,
      alreadySynced: 1,
      deleted: 1,
      failed: 0,
      unsupported: 0,
      totalDiscovered: 2,
    })
  })

  it("deletes existing files removed from SharePoint", async () => {
    const sourceId = "sharepoint_source_1"
    const siteId = "site-1"

    mockAgentsGetOrThrow.mockResolvedValue(
      makeSharePointAgent(sourceId, siteId)
    )

    mockKnowledgeBaseListFiles.mockResolvedValue([
      makeSharePointFile({
        id: "existing_keep",
        sourceId,
        siteId,
        driveId: "drive-a",
        itemId: "item-keep",
        path: "keep/file.txt",
      }),
      makeSharePointFile({
        id: "existing_removed",
        sourceId,
        siteId,
        driveId: "drive-a",
        itemId: "item-removed",
        path: "removed/file.txt",
      }),
    ])

    const fetchMock = createFetchMock([
      {
        match: `/sites/${encodeURIComponent(siteId)}/drives`,
        response: {
          ok: true,
          status: 200,
          json: async () => ({
            value: [{ id: "drive-a" }],
          }),
        } as Response,
      },
      {
        match: "/drives/drive-a/root/children",
        response: {
          ok: true,
          status: 200,
          json: async () => ({
            value: [
              {
                id: "item-keep",
                name: "file.txt",
                file: { mimeType: "text/plain" },
              },
            ],
          }),
        } as Response,
      },
      {
        match: "/drives/drive-a/items/item-1/content",
        response: {
          ok: true,
          status: 200,
          arrayBuffer: async () => toArrayBuffer("legacy content"),
        } as Response,
      },
    ])

    const result = await syncSharePointSourcesForAgent("agent_1", sourceId)

    expect(fetchMock).toHaveBeenCalled()
    expect(mockDeleteFileForAgent).toHaveBeenCalledTimes(1)
    expect(mockDeleteFileForAgent).toHaveBeenCalledWith(
      "agent_1",
      "existing_removed"
    )
    expect(result).toMatchObject({
      synced: 0,
      alreadySynced: 1,
      deleted: 1,
      failed: 0,
      unsupported: 0,
      totalDiscovered: 1,
    })
  })

  it("re-ingests when etag changes", async () => {
    const sourceId = "sharepoint_source_1"
    const siteId = "site-1"

    mockAgentsGetOrThrow.mockResolvedValue(
      makeSharePointAgent(sourceId, siteId)
    )

    mockKnowledgeBaseListFiles.mockResolvedValue([
      makeSharePointFile({
        id: "existing_changed",
        sourceId,
        siteId,
        driveId: "drive-a",
        itemId: "item-1",
        path: "changed.txt",
        etag: "old-etag",
      }),
    ])

    const fetchMock = createFetchMock([
      {
        match: `/sites/${encodeURIComponent(siteId)}/drives`,
        response: {
          ok: true,
          status: 200,
          json: async () => ({ value: [{ id: "drive-a" }] }),
        } as Response,
      },
      {
        match: "/drives/drive-a/root/children",
        response: {
          ok: true,
          status: 200,
          json: async () => ({
            value: [
              {
                id: "item-1",
                name: "changed.txt",
                eTag: "new-etag",
                size: 123,
                lastModifiedDateTime: "2026-01-01T00:00:00.000Z",
                file: { mimeType: "text/plain" },
              },
            ],
          }),
        } as Response,
      },
      {
        match: "/drives/drive-a/items/item-1/content",
        response: {
          ok: true,
          status: 200,
          arrayBuffer: async () => toArrayBuffer("updated content"),
        } as Response,
      },
    ])

    const result = await syncSharePointSourcesForAgent("agent_1", sourceId)

    expect(fetchMock).toHaveBeenCalled()
    expect(mockDeleteFileForAgent).toHaveBeenCalledWith(
      "agent_1",
      "existing_changed"
    )
    expect(mockKnowledgeBaseUploadFile).toHaveBeenCalledTimes(1)
    expect(mockKnowledgeBaseUploadFile).toHaveBeenCalledWith(
      expect.objectContaining({
        source: expect.objectContaining({
          etag: "new-etag",
          lastModifiedAt: "2026-01-01T00:00:00.000Z",
          remoteSize: 123,
          externalId: `${siteId}:drive-a:item-1`,
        }),
      })
    )
    expect(result).toMatchObject({
      synced: 1,
      deleted: 1,
      alreadySynced: 0,
    })
  })

  it("re-ingests when etag is unavailable and fallback metadata changes", async () => {
    const sourceId = "sharepoint_source_1"
    const siteId = "site-1"

    mockAgentsGetOrThrow.mockResolvedValue(
      makeSharePointAgent(sourceId, siteId)
    )

    mockKnowledgeBaseListFiles.mockResolvedValue([
      makeSharePointFile({
        id: "existing_changed",
        sourceId,
        siteId,
        driveId: "drive-a",
        itemId: "item-1",
        path: "changed.txt",
        lastModifiedAt: "2026-01-01T00:00:00.000Z",
        remoteSize: 100,
      }),
    ])

    const fetchMock = createFetchMock([
      {
        match: `/sites/${encodeURIComponent(siteId)}/drives`,
        response: {
          ok: true,
          status: 200,
          json: async () => ({ value: [{ id: "drive-a" }] }),
        } as Response,
      },
      {
        match: "/drives/drive-a/root/children",
        response: {
          ok: true,
          status: 200,
          json: async () => ({
            value: [
              {
                id: "item-1",
                name: "changed.txt",
                size: 150,
                lastModifiedDateTime: "2026-01-02T00:00:00.000Z",
                file: { mimeType: "text/plain" },
              },
            ],
          }),
        } as Response,
      },
      {
        match: "/drives/drive-a/items/item-1/content",
        response: {
          ok: true,
          status: 200,
          arrayBuffer: async () => toArrayBuffer("updated content"),
        } as Response,
      },
    ])

    const result = await syncSharePointSourcesForAgent("agent_1", sourceId)

    expect(fetchMock).toHaveBeenCalled()
    expect(mockDeleteFileForAgent).toHaveBeenCalledWith(
      "agent_1",
      "existing_changed"
    )
    expect(mockKnowledgeBaseUploadFile).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      synced: 1,
      deleted: 1,
      alreadySynced: 0,
    })
  })

  it("re-ingests legacy files when remote metadata becomes available", async () => {
    const sourceId = "sharepoint_source_1"
    const siteId = "site-1"

    mockAgentsGetOrThrow.mockResolvedValue(
      makeSharePointAgent(sourceId, siteId)
    )

    mockKnowledgeBaseListFiles.mockResolvedValue([
      makeSharePointFile({
        id: "existing_legacy",
        sourceId,
        siteId,
        driveId: "drive-a",
        itemId: "item-1",
        path: "legacy.txt",
      }),
    ])

    const fetchMock = createFetchMock([
      {
        match: `/sites/${encodeURIComponent(siteId)}/drives`,
        response: {
          ok: true,
          status: 200,
          json: async () => ({ value: [{ id: "drive-a" }] }),
        } as Response,
      },
      {
        match: "/drives/drive-a/root/children",
        response: {
          ok: true,
          status: 200,
          json: async () => ({
            value: [
              {
                id: "item-1",
                name: "legacy.txt",
                eTag: "new-etag",
                size: 150,
                lastModifiedDateTime: "2026-01-02T00:00:00.000Z",
                file: { mimeType: "text/plain" },
              },
            ],
          }),
        } as Response,
      },
      {
        match: "/drives/drive-a/items/item-1/content",
        response: {
          ok: true,
          status: 200,
          arrayBuffer: async () => toArrayBuffer("legacy content"),
        } as Response,
      },
    ])

    const result = await syncSharePointSourcesForAgent("agent_1", sourceId)

    expect(fetchMock).toHaveBeenCalled()
    expect(mockDeleteFileForAgent).toHaveBeenCalledWith(
      "agent_1",
      "existing_legacy"
    )
    expect(mockKnowledgeBaseUploadFile).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      synced: 1,
      alreadySynced: 0,
      deleted: 1,
    })
  })

  it("does not re-ingest legacy files when remote metadata is unavailable", async () => {
    const sourceId = "sharepoint_source_1"
    const siteId = "site-1"

    mockAgentsGetOrThrow.mockResolvedValue(
      makeSharePointAgent(sourceId, siteId)
    )

    mockKnowledgeBaseListFiles.mockResolvedValue([
      makeSharePointFile({
        id: "existing_legacy",
        sourceId,
        siteId,
        driveId: "drive-a",
        itemId: "item-1",
        path: "legacy.txt",
      }),
    ])

    const fetchMock = createFetchMock([
      {
        match: `/sites/${encodeURIComponent(siteId)}/drives`,
        response: {
          ok: true,
          status: 200,
          json: async () => ({ value: [{ id: "drive-a" }] }),
        } as Response,
      },
      {
        match: "/drives/drive-a/root/children",
        response: {
          ok: true,
          status: 200,
          json: async () => ({
            value: [
              {
                id: "item-1",
                name: "legacy.txt",
                file: { mimeType: "text/plain" },
              },
            ],
          }),
        } as Response,
      },
    ])

    const result = await syncSharePointSourcesForAgent("agent_1", sourceId)

    expect(fetchMock).toHaveBeenCalled()
    expect(mockDeleteFileForAgent).not.toHaveBeenCalled()
    expect(mockKnowledgeBaseUploadFile).not.toHaveBeenCalled()
    expect(result).toMatchObject({
      synced: 0,
      alreadySynced: 1,
      deleted: 0,
    })
  })

  it("retries files that previously failed ingestion via queue", async () => {
    const sourceId = "sharepoint_source_1"
    const siteId = "site-1"

    mockAgentsGetOrThrow.mockResolvedValue(
      makeSharePointAgent(sourceId, siteId)
    )

    mockKnowledgeBaseListFiles.mockResolvedValue([
      makeSharePointFile({
        id: "existing_failed",
        sourceId,
        siteId,
        driveId: "drive-a",
        itemId: "item-1",
        path: "failed.txt",
        status: KnowledgeBaseFileStatus.FAILED,
      }),
    ])

    const fetchMock = createFetchMock([
      {
        match: `/sites/${encodeURIComponent(siteId)}/drives`,
        response: {
          ok: true,
          status: 200,
          json: async () => ({
            value: [{ id: "drive-a" }],
          }),
        } as Response,
      },
      {
        match: "/drives/drive-a/root/children",
        response: {
          ok: true,
          status: 200,
          json: async () => ({
            value: [
              {
                id: "item-1",
                name: "failed.txt",
                file: { mimeType: "text/plain" },
              },
            ],
          }),
        } as Response,
      },
    ])

    const result = await syncSharePointSourcesForAgent("agent_1", sourceId)

    expect(fetchMock).toHaveBeenCalled()
    expect(mockRetryKnowledgeBaseFileIngestion).toHaveBeenCalledTimes(1)
    expect(mockRetryKnowledgeBaseFileIngestion).toHaveBeenCalledWith(
      "existing_failed"
    )
    expect(mockDeleteFileForAgent).not.toHaveBeenCalled()
    expect(mockKnowledgeBaseUploadFile).not.toHaveBeenCalled()
    expect(result).toMatchObject({
      agentId: "agent_1",
      synced: 1,
      alreadySynced: 0,
      failed: 0,
      unsupported: 0,
      totalDiscovered: 1,
    })
  })

  it("does not retry failed files that belong to another knowledge source", async () => {
    const sourceId = "sharepoint_source_1"
    const siteId = "site-1"

    mockAgentsGetOrThrow.mockResolvedValue(
      makeSharePointAgent(sourceId, siteId)
    )

    mockKnowledgeBaseListFiles.mockResolvedValue([
      makeSharePointFile({
        id: "existing_failed_other_source",
        sourceId: "sharepoint_source_other",
        siteId,
        driveId: "drive-a",
        itemId: "item-1",
        path: "failed.txt",
        status: KnowledgeBaseFileStatus.FAILED,
      }),
    ])

    const fetchMock = createFetchMock([
      {
        match: `/sites/${encodeURIComponent(siteId)}/drives`,
        response: {
          ok: true,
          status: 200,
          json: async () => ({
            value: [{ id: "drive-a" }],
          }),
        } as Response,
      },
      {
        match: "/drives/drive-a/root/children",
        response: {
          ok: true,
          status: 200,
          json: async () => ({
            value: [
              {
                id: "item-1",
                name: "failed.txt",
                file: { mimeType: "text/plain" },
              },
            ],
          }),
        } as Response,
      },
    ])

    const result = await syncSharePointSourcesForAgent("agent_1", sourceId)

    expect(fetchMock).toHaveBeenCalled()
    expect(mockRetryKnowledgeBaseFileIngestion).not.toHaveBeenCalled()
    expect(mockDeleteFileForAgent).not.toHaveBeenCalled()
    expect(mockKnowledgeBaseUploadFile).not.toHaveBeenCalled()
    expect(result).toMatchObject({
      agentId: "agent_1",
      synced: 0,
      alreadySynced: 1,
      failed: 0,
      unsupported: 0,
      totalDiscovered: 1,
    })
  })

  it("does not delete and re-ingest files owned by another knowledge source when metadata changes", async () => {
    const sourceId = "sharepoint_source_1"
    const siteId = "site-1"

    mockAgentsGetOrThrow.mockResolvedValue(
      makeSharePointAgent(sourceId, siteId)
    )

    mockKnowledgeBaseListFiles.mockResolvedValue([
      makeSharePointFile({
        id: "existing_other_source",
        sourceId: "sharepoint_source_other",
        siteId,
        driveId: "drive-a",
        itemId: "item-1",
        path: "changed.txt",
        etag: "old-etag",
      }),
    ])

    const fetchMock = createFetchMock([
      {
        match: `/sites/${encodeURIComponent(siteId)}/drives`,
        response: {
          ok: true,
          status: 200,
          json: async () => ({ value: [{ id: "drive-a" }] }),
        } as Response,
      },
      {
        match: "/drives/drive-a/root/children",
        response: {
          ok: true,
          status: 200,
          json: async () => ({
            value: [
              {
                id: "item-1",
                name: "changed.txt",
                eTag: "new-etag",
                size: 123,
                lastModifiedDateTime: "2026-01-01T00:00:00.000Z",
                file: { mimeType: "text/plain" },
              },
            ],
          }),
        } as Response,
      },
    ])

    const result = await syncSharePointSourcesForAgent("agent_1", sourceId)

    expect(fetchMock).toHaveBeenCalled()
    expect(mockDeleteFileForAgent).not.toHaveBeenCalled()
    expect(mockKnowledgeBaseUploadFile).not.toHaveBeenCalled()
    expect(result).toMatchObject({
      agentId: "agent_1",
      synced: 0,
      alreadySynced: 1,
      failed: 0,
      unsupported: 0,
      totalDiscovered: 1,
    })
  })
})
