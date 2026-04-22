import { describe, expect, it, vi } from "vitest"
import {
  AgentKnowledgeSourceSyncRunStatus,
  KnowledgeBaseFileSourceType,
  KnowledgeBaseFileStatus,
  type KnowledgeBaseFile,
} from "@budibase/types"
import {
  formatTimestamp,
  getSharePointFileProcessingCounts,
  getSharePointFilesForSite,
  getSharePointLastSyncLabel,
  toFileTableRows,
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

  it("builds and sorts file rows", async () => {
    const onDelete = vi.fn(async () => {})
    const rows = toFileTableRows(
      [
        makeFile({ _id: "2", filename: "z.md" }),
        makeFile({ _id: "1", filename: "a.md" }),
      ],
      onDelete
    )

    expect(rows.map(row => row.filename)).toEqual(["a.md", "z.md"])
    await rows[0].onDelete?.()
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it("filters and counts sharepoint files by site", () => {
    const files = [
      makeFile({
        _id: "f1",
        status: KnowledgeBaseFileStatus.READY,
        source: {
          type: KnowledgeBaseFileSourceType.SHAREPOINT,
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
          type: KnowledgeBaseFileSourceType.SHAREPOINT,
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
          type: KnowledgeBaseFileSourceType.SHAREPOINT,
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
      loadingSharePointSites: false,
      onDelete: async () => {},
      onSync: async () => {},
    })

    expect(rows).toHaveLength(1)
    expect(rows[0].hasSynced).toBe(true)
    expect(rows[0].displayStatus).toBe("0/1 files")
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
      loadingSharePointSites: false,
      onDelete: async () => {},
      onSync: async () => {},
    })

    expect(rows).toHaveLength(1)
    expect(rows[0].hasSynced).toBe(true)
    expect(rows[0].displayStatus).toBe("3/3 files")
  })
})
