import { describe, expect, it, vi } from "vitest"
import {
  AgentKnowledgeSourceSyncEntryStatus,
  AgentKnowledgeSourceSyncRunStatus,
  KnowledgeBaseFileStatus,
  type KnowledgeBaseFile,
  type KnowledgeSourceSyncRun,
} from "@budibase/types"
import {
  formatTimestamp,
  getSharePointIncludedProgress,
  getSharePointFileProcessingCounts,
  getSharePointFilesForSite,
  getSharePointLastSyncLabel,
  toSharePointConnectionRows,
  toFileTableRows,
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
    await rows[0].onDelete()
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it("filters and counts sharepoint files by site", () => {
    const files = [
      makeFile({
        _id: "f1",
        status: KnowledgeBaseFileStatus.READY,
        externalSourceId: "sharepoint:site-1:drive-1:item-1",
      }),
      makeFile({
        _id: "f2",
        status: KnowledgeBaseFileStatus.PROCESSING,
        externalSourceId: "sharepoint:site-1:drive-1:item-2",
      }),
      makeFile({
        _id: "f3",
        status: KnowledgeBaseFileStatus.FAILED,
        externalSourceId: "sharepoint:site-2:drive-1:item-3",
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
    const runsBySiteId: Record<string, KnowledgeSourceSyncRun> = {
      "site-1": {
        sourceId: "site-1",
        lastRunAt: "2026-04-08T10:00:00.000Z",
        synced: 1,
        failed: 0,
        skipped: 0,
        totalDiscovered: 1,
        status: AgentKnowledgeSourceSyncRunStatus.SUCCESS,
      },
    }
    expect(getSharePointLastSyncLabel(runsBySiteId, "site-1")).toContain(
      "Last sync at"
    )
    expect(getSharePointLastSyncLabel({}, "site-1")).toBe("SharePoint")
  })

  it("computes included progress from sync entries", () => {
    const files = [
      makeFile({
        _id: "f1",
        status: KnowledgeBaseFileStatus.READY,
        externalSourceId: "sharepoint:site-1:drive-1:item-1",
      }),
      makeFile({
        _id: "f2",
        status: KnowledgeBaseFileStatus.PROCESSING,
        externalSourceId: "sharepoint:site-1:drive-1:item-2",
      }),
    ]
    const run: KnowledgeSourceSyncRun = {
      sourceId: "site-1",
      lastRunAt: "2026-04-08T10:00:00.000Z",
      synced: 2,
      failed: 0,
      skipped: 2,
      unsupported: 1,
      totalDiscovered: 5,
      status: AgentKnowledgeSourceSyncRunStatus.SUCCESS,
      entries: [
        {
          driveId: "drive-1",
          itemId: "item-1",
          filename: "a.txt",
          path: "a.txt",
          externalSourceId: "sharepoint:site-1:drive-1:item-1",
          status: AgentKnowledgeSourceSyncEntryStatus.SYNCED,
        },
        {
          driveId: "drive-1",
          itemId: "item-2",
          filename: "b.txt",
          path: "b.txt",
          externalSourceId: "sharepoint:site-1:drive-1:item-2",
          status: AgentKnowledgeSourceSyncEntryStatus.SYNCED,
        },
        {
          driveId: "drive-1",
          itemId: "item-3",
          filename: "c.exe",
          path: "c.exe",
          externalSourceId: "sharepoint:site-1:drive-1:item-3",
          status: AgentKnowledgeSourceSyncEntryStatus.UNSUPPORTED,
        },
        {
          driveId: "drive-1",
          itemId: "item-4",
          filename: "d.txt",
          path: "d.txt",
          externalSourceId: "sharepoint:site-1:drive-1:item-4",
          status: AgentKnowledgeSourceSyncEntryStatus.EXCLUDED,
        },
      ],
    }

    expect(getSharePointIncludedProgress(files, run)).toEqual({
      processed: 2,
      totalSelected: 3,
    })
  })

  it("uses included progress for sharepoint row status text", () => {
    const files = [
      makeFile({
        _id: "f1",
        status: KnowledgeBaseFileStatus.READY,
        externalSourceId: "sharepoint:site-1:drive-1:item-1",
      }),
      makeFile({
        _id: "f2",
        status: KnowledgeBaseFileStatus.PROCESSING,
        externalSourceId: "sharepoint:site-1:drive-1:item-2",
      }),
    ]
    const rows = toSharePointConnectionRows({
      hasSharePointConnection: true,
      selectedSiteIds: ["site-1"],
      sharePointSources: [
        {
          id: "source-1",
          config: { site: { id: "site-1", name: "Site A" } },
        },
      ],
      sharePointSyncRunsBySiteId: {
        "site-1": {
          sourceId: "site-1",
          lastRunAt: "2026-04-08T10:00:00.000Z",
          synced: 2,
          failed: 0,
          skipped: 2,
          unsupported: 1,
          totalDiscovered: 5,
          status: AgentKnowledgeSourceSyncRunStatus.SUCCESS,
          entries: [
            {
              driveId: "drive-1",
              itemId: "item-1",
              filename: "a.txt",
              path: "a.txt",
              externalSourceId: "sharepoint:site-1:drive-1:item-1",
              status: AgentKnowledgeSourceSyncEntryStatus.SYNCED,
            },
            {
              driveId: "drive-1",
              itemId: "item-2",
              filename: "b.txt",
              path: "b.txt",
              externalSourceId: "sharepoint:site-1:drive-1:item-2",
              status: AgentKnowledgeSourceSyncEntryStatus.SYNCED,
            },
            {
              driveId: "drive-1",
              itemId: "item-3",
              filename: "c.exe",
              path: "c.exe",
              externalSourceId: "sharepoint:site-1:drive-1:item-3",
              status: AgentKnowledgeSourceSyncEntryStatus.UNSUPPORTED,
            },
            {
              driveId: "drive-1",
              itemId: "item-4",
              filename: "d.txt",
              path: "d.txt",
              externalSourceId: "sharepoint:site-1:drive-1:item-4",
              status: AgentKnowledgeSourceSyncEntryStatus.EXCLUDED,
            },
          ],
        },
      },
      files,
      loadingSharePointSites: false,
      onDelete: async () => {},
      onSync: async () => {},
      onConfigure: async () => {},
    })

    expect(rows[0].displayStatus).toBe("2/3 files")
    expect(rows[0].totalCount).toBe(3)
  })
})
