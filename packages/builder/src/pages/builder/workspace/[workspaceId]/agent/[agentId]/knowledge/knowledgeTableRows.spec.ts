import { describe, expect, it, vi } from "vitest"
import {
  AgentKnowledgeSourceSyncRunStatus,
  KnowledgeBaseFileSourceType,
  KnowledgeBaseFileStatus,
  type KnowledgeBaseFile,
} from "@budibase/types"
import {
  formatTimestamp,
  getFileKnowledgeCounts,
  getSharePointFileProcessingCounts,
  getSharePointFilesForSite,
  getSharePointLastSyncLabel,
  toFileKnowledgeRows,
  toSharePointConnectionRows,
} from "./knowledgeTableRows"

const makeFile = (
  overrides: Partial<KnowledgeBaseFile>
): KnowledgeBaseFile => ({
  _id: "file_1",
  knowledgeBaseId: "kb_1",
  filename: "file.txt",
  objectStoreKey: "object/key",
  ragSourceId: "rag_source_1",
  status: KnowledgeBaseFileStatus.READY,
  uploadedBy: "user_1",
  ...overrides,
})

describe("knowledgeTableRows", () => {
  it("formats timestamp fallback safely", () => {
    expect(formatTimestamp(undefined)).toBe("—")
  })

  it("includes pending upload rows", () => {
    const rows = toFileKnowledgeRows({
      files: [makeFile({ filename: "a.md" })],
      pendingUploads: [
        {
          tempId: "pending-1",
          filename: "b.md",
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    })

    expect(rows.map(row => row.filename)).toEqual(["a.md", "b.md"])
    expect(rows.find(row => row.filename === "b.md")?.displayStatus).toBe(
      "Uploading"
    )
  })

  it("shows pending uploads even when another file has the same filename", () => {
    const rows = toFileKnowledgeRows({
      files: [
        makeFile({
          filename: "notes.txt",
          status: KnowledgeBaseFileStatus.PROCESSING,
        }),
      ],
      pendingUploads: [
        {
          tempId: "pending-1",
          filename: "notes.txt",
          createdAt: "2026-01-01T00:00:00.000Z",
        },
        {
          tempId: "pending-2",
          filename: "notes.txt",
          createdAt: "2026-01-01T00:00:01.000Z",
        },
      ],
    })

    expect(rows).toHaveLength(3)
    expect(
      rows.filter(row => row.displayStatus === "Uploading").map(row => row._id)
    ).toEqual(["pending-1", "pending-2"])
    expect(rows.find(row => row._id === "file_1")?.displayStatus).toBe(
      "Processing"
    )
  })

  it("builds and sorts file rows", async () => {
    const onDelete = vi.fn(async () => {})
    const rows = toFileKnowledgeRows({
      files: [
        makeFile({ _id: "2", filename: "z.md" }),
        makeFile({ _id: "1", filename: "a.md" }),
      ],
      onDelete,
    })

    expect(rows.map(row => row.filename)).toEqual(["a.md", "z.md"])
    await rows[0].onDelete?.()
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it("marks file actions unavailable when knowledge search is unavailable", () => {
    const rows = toFileKnowledgeRows({
      files: [makeFile({ filename: "notes.md" })],
      knowledgeSearchConfigured: false,
    })

    expect(rows[0].knowledgeSearchConfigured).toBe(false)
  })

  it("sorts failed files first", () => {
    const rows = toFileKnowledgeRows({
      files: [
        makeFile({ _id: "1", filename: "a.md" }),
        makeFile({
          _id: "2",
          filename: "z.md",
          status: KnowledgeBaseFileStatus.FAILED,
        }),
      ],
    })

    expect(rows.map(row => row.filename)).toEqual(["z.md", "a.md"])
  })

  it("retries a failed file", async () => {
    const onRetry = vi.fn(async () => {})
    const failedFile = makeFile({
      status: KnowledgeBaseFileStatus.FAILED,
      errorMessage: "Resource has been exhausted",
    })
    const rows = toFileKnowledgeRows({ files: [failedFile], onRetry })

    expect(rows[0]).toEqual(
      expect.objectContaining({
        displayStatus: "Failed",
        errorMessage: "Resource has been exhausted",
        canRetry: true,
      })
    )
    await rows[0].onRetry?.()
    expect(onRetry).toHaveBeenCalledWith(failedFile)
  })

  it("does not offer retry for files that have not failed", () => {
    const rows = toFileKnowledgeRows({
      files: [makeFile({ status: KnowledgeBaseFileStatus.READY })],
      onRetry: async () => {},
    })

    expect(rows[0].canRetry).toBe(false)
  })

  it("includes rejected uploads as failed rows with their reason", async () => {
    const onRetryRejected = vi.fn(async () => {})
    const onDismissRejected = vi.fn()
    const rows = toFileKnowledgeRows({
      files: [],
      rejectedUploads: [
        {
          tempId: "rejected-1",
          filename: "notes.txt",
          size: 10,
          reason: "Bad Gateway",
          retryable: true,
          createdAt: "2026-01-01T00:00:00.000Z",
        },
        {
          tempId: "rejected-2",
          filename: "huge.pdf",
          size: 10,
          reason: "File exceeds the 100MB limit",
          retryable: false,
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      ],
      onRetryRejected,
      onDismissRejected,
    })

    expect(rows).toEqual([
      expect.objectContaining({
        filename: "huge.pdf",
        status: KnowledgeBaseFileStatus.FAILED,
        displayStatus: "Failed",
        errorMessage: "File exceeds the 100MB limit",
        isRejected: true,
        canRetry: false,
      }),
      expect.objectContaining({
        filename: "notes.txt",
        errorMessage: "Bad Gateway",
        isRejected: true,
        canRetry: true,
      }),
    ])
    await rows[1].onRetry?.()
    rows[1].onDismiss?.()
    expect(onRetryRejected).toHaveBeenCalledWith("rejected-1")
    expect(onDismissRejected).toHaveBeenCalledWith("rejected-1")
  })

  it("counts file rows by status", () => {
    const rows = toFileKnowledgeRows({
      files: [
        makeFile({ _id: "1", status: KnowledgeBaseFileStatus.READY }),
        makeFile({ _id: "2", status: KnowledgeBaseFileStatus.PROCESSING }),
        makeFile({ _id: "3", status: KnowledgeBaseFileStatus.FAILED }),
      ],
      pendingUploads: [
        {
          tempId: "pending-1",
          filename: "b.md",
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      ],
      rejectedUploads: [
        {
          tempId: "rejected-1",
          filename: "c.md",
          size: 10,
          reason: "Bad Gateway",
          retryable: true,
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    })

    expect(getFileKnowledgeCounts(rows)).toEqual({
      ready: 1,
      processing: 2,
      failed: 2,
      total: 5,
    })
  })

  it("filters and counts sharepoint files by site", () => {
    const files = [
      makeFile({
        _id: "f1",
        status: KnowledgeBaseFileStatus.READY,
        source: {
          type: KnowledgeBaseFileSourceType.SHAREPOINT_SITE,
          knowledgeSourceId: "source-1",
          siteId: "site-1",
          driveId: "drive-1",
          itemId: "item-1",
          path: "folder-1/file-1.txt",
        },
      }),
      makeFile({
        _id: "f2",
        status: KnowledgeBaseFileStatus.PROCESSING,
        source: {
          type: KnowledgeBaseFileSourceType.SHAREPOINT_SITE,
          knowledgeSourceId: "source-1",
          siteId: "site-1",
          driveId: "drive-1",
          itemId: "item-2",
          path: "folder-1/file-2.txt",
        },
      }),
      makeFile({
        _id: "f3",
        status: KnowledgeBaseFileStatus.FAILED,
        source: {
          type: KnowledgeBaseFileSourceType.SHAREPOINT_SITE,
          knowledgeSourceId: "source-2",
          siteId: "site-2",
          driveId: "drive-1",
          itemId: "item-3",
          path: "folder-2/file-3.txt",
        },
      }),
    ]

    expect(
      getSharePointFilesForSite(files, "site-1").map(file => file._id)
    ).toEqual(["f1", "f2"])
    expect(getSharePointFileProcessingCounts(files, "site-1")).toEqual({
      ready: 1,
      failed: 0,
      processing: 1,
    })
  })

  it("formats sharepoint last sync label from run state", () => {
    expect(getSharePointLastSyncLabel("2026-04-08T10:00:00.000Z")).toContain(
      "Last sync at"
    )
    expect(getSharePointLastSyncLabel()).toBe("SharePoint")
  })

  it("shows processing while syncing", () => {
    const rows = toSharePointConnectionRows({
      sharePointSources: [
        {
          id: "source-1",
          config: { site: { id: "site-1", name: "Site 1" } },
        },
      ],
      sharePointSourceSnapshots: [
        {
          sourceId: "source-1",
          name: "Site 1",
          syncedCount: 0,
          failedCount: 0,
          processingCount: 1,
          totalCount: 1,
          runStatus: AgentKnowledgeSourceSyncRunStatus.SUCCESS,
          lastRunAt: "2026-04-08T10:00:00.000Z",
        },
      ],
      onDelete: async () => {},
      onSync: async () => {},
    })

    expect(rows).toHaveLength(1)
    expect(rows[0].hasSynced).toBe(true)
    expect(rows[0].displayStatus).toBe("0/1 ready")
  })

  it("shows file counts while sync is still running", () => {
    const rows = toSharePointConnectionRows({
      sharePointSources: [
        {
          id: "source-1",
          config: {
            site: {
              id: "site-1",
              name: "confluence",
              webUrl: "https://example.sharepoint.com/sites/confluence",
            },
          },
        },
      ],
      sharePointSourceSnapshots: [
        {
          sourceId: "source-1",
          name: "confluence",
          webUrl: "https://example.sharepoint.com/sites/confluence",
          syncedCount: 18,
          failedCount: 0,
          processingCount: 107,
          totalCount: 125,
        },
      ],
      onDelete: async () => {},
      onSync: async () => {},
    })

    expect(rows[0].displayStatus).toBe("18/125 ready")
    expect(rows[0].hasSynced).toBe(true)
    expect(rows[0].__clickable).toBe(true)
  })

  it("shows loading label when site metadata is not available yet", () => {
    const rows = toSharePointConnectionRows({
      sharePointSources: [
        {
          id: "source-1",
          config: { site: { id: "site-1" } },
        },
      ],
      sharePointSourceSnapshots: [],
      onDelete: async () => {},
      onSync: async () => {},
    })

    expect(rows).toHaveLength(1)
    expect(rows[0].filename).toBe("Loading SharePoint site...")
    expect(rows[0].displayStatus).toBe("Processing")
  })

  it.each([
    [AgentKnowledgeSourceSyncRunStatus.QUEUED, "Queued"],
    [AgentKnowledgeSourceSyncRunStatus.RUNNING, "Syncing"],
  ])("shows active sync status %s", (runStatus, displayStatus) => {
    const rows = toSharePointConnectionRows({
      sharePointSources: [
        {
          id: "source-1",
          config: { site: { id: "site-1", name: "Site 1" } },
        },
      ],
      sharePointSourceSnapshots: [
        {
          sourceId: "source-1",
          syncedCount: 3,
          failedCount: 0,
          processingCount: 0,
          totalCount: 3,
          runStatus,
          lastRunAt: "2026-04-08T10:00:00.000Z",
        },
      ],
      onDelete: async () => {},
      onSync: async () => {},
    })

    expect(rows[0].displayStatus).toBe(displayStatus)
    expect(rows[0].isSyncing).toBe(true)
  })

  it("shows completed counts once syncing is done", () => {
    const rows = toSharePointConnectionRows({
      sharePointSources: [
        {
          id: "source-1",
          config: { site: { id: "site-1", name: "Site 1" } },
        },
      ],
      sharePointSourceSnapshots: [
        {
          sourceId: "source-1",
          name: "Site 1",
          syncedCount: 3,
          failedCount: 0,
          processingCount: 0,
          totalCount: 3,
          runStatus: AgentKnowledgeSourceSyncRunStatus.SUCCESS,
          lastRunAt: "2026-04-08T10:00:00.000Z",
        },
      ],
      onDelete: async () => {},
      onSync: async () => {},
    })

    expect(rows).toHaveLength(1)
    expect(rows[0].hasSynced).toBe(true)
    expect(rows[0].displayStatus).toBe("3/3 ready")
  })

  it("shows failed file counts separately from ready files", () => {
    const rows = toSharePointConnectionRows({
      sharePointSources: [
        {
          id: "source-1",
          config: { site: { id: "site-1", name: "Site 1" } },
        },
      ],
      sharePointSourceSnapshots: [
        {
          sourceId: "source-1",
          name: "Site 1",
          syncedCount: 300,
          failedCount: 300,
          processingCount: 0,
          totalCount: 600,
          runStatus: AgentKnowledgeSourceSyncRunStatus.SUCCESS,
          lastRunAt: "2026-04-08T10:00:00.000Z",
        },
      ],
      onDelete: async () => {},
      onSync: async () => {},
    })

    expect(rows[0].displayStatus).toBe("300/600 ready · 300 failed")
  })
})
