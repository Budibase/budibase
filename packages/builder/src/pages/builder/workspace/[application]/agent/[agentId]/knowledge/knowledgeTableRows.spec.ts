import { describe, expect, it, vi } from "vitest"
import {
  KnowledgeBaseFileStatus,
  type KnowledgeBaseFile,
} from "@budibase/types"
import {
  formatTimestamp,
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
  knowledgeBaseId: "local_upload",
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

  it("formats sharepoint last sync label from snapshot", () => {
    expect(
      getSharePointLastSyncLabel({
        sourceId: "source-1",
        siteId: "site-1",
        lastRunAt: "2026-04-08T10:00:00.000Z",
        syncedCount: 1,
        failedCount: 0,
        processingCount: 0,
        totalCount: 1,
      })
    ).toContain("Last sync at")
    expect(getSharePointLastSyncLabel(undefined)).toBe("SharePoint")
  })

  it("uses backend snapshot for sharepoint row status text", () => {
    const rows = toSharePointConnectionRows({
      sharePointSourceSnapshots: [
        {
          sourceId: "source-1",
          siteId: "site-1",
          name: "Site A",
          lastRunAt: "2026-04-08T10:00:00.000Z",
          syncedCount: 1,
          failedCount: 0,
          processingCount: 1,
          totalCount: 2,
        },
      ],
      onDelete: async () => {},
      onSync: async () => {},
      onClick: async () => {},
    })

    expect(rows[0].displayStatus).toBe("1/2 files")
    expect(rows[0].totalCount).toBe(2)
  })
})
