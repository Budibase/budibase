import { cleanup, fireEvent, render, waitFor } from "@testing-library/svelte"
import { afterEach, describe, expect, it, vi } from "vitest"
import { KnowledgeBaseFileStatus } from "@budibase/types"
import KnowledgeCard from "./KnowledgeCard.svelte"
import type {
  FileKnowledgeTableRow,
  SharePointConnectionTableRow,
} from "./renderers/types"

const createSharePointRow = (): SharePointConnectionTableRow => ({
  kind: "sharepoint_connection",
  _id: "source-1",
  sourceId: "source-1",
  siteId: "site-1",
  filename: "Support documents",
  subtitle: "SharePoint",
  displayStatus: "Processing",
  syncedCount: 0,
  totalCount: 0,
  failedCount: 0,
  processingCount: 0,
  hasSynced: false,
  isSyncing: false,
  knowledgeSearchConfigured: false,
  onDelete: async () => {},
  onSync: async () => {},
})

const createFileRow = (): FileKnowledgeTableRow => ({
  kind: "file",
  _id: "file-1",
  filename: "Support notes.txt",
  status: KnowledgeBaseFileStatus.PROCESSING,
  displayStatus: "Uploading",
  size: "1 KB",
  updatedAt: "2026-01-01",
  isUploading: true,
  canRetry: false,
  knowledgeSearchConfigured: false,
})

afterEach(cleanup)

describe("KnowledgeCard", () => {
  it.each([createSharePointRow(), createFileRow()])(
    "opens $kind details before processing completes, even without knowledge search",
    async row => {
      const onClick = vi.fn()
      const { getByRole } = render(KnowledgeCard, { row, onClick })
      await fireEvent.click(getByRole("button"))

      expect(onClick).toHaveBeenCalledWith(row)
      expect(getByRole("button").tagName).toBe("BUTTON")
    }
  )

  it("keeps failure information and actions in details rather than the card", () => {
    const { getByRole, queryByText } = render(KnowledgeCard, {
      row: {
        ...createFileRow(),
        status: KnowledgeBaseFileStatus.FAILED,
        displayStatus: "Failed",
        isUploading: false,
        canRetry: true,
        errorMessage: "Upload rejected",
        onRetry: async () => {},
        onDelete: async () => {},
      },
    })

    expect(getByRole("button")).toHaveTextContent("Support notes.txt")
    expect(getByRole("button")).toHaveTextContent("Failed")
    expect(queryByText("Upload rejected")).toBeNull()
    expect(queryByText("Retry")).toBeNull()
    expect(queryByText("Remove")).toBeNull()
  })

  it("shows the full filename on hover using the Budibase tooltip", async () => {
    const filename = `${"Very long filename ".repeat(20)}.txt`
    const target = document.createElement("div")
    target.className = "spectrum"
    document.body.appendChild(target)
    try {
      const { getByText } = render(KnowledgeCard, {
        props: { row: { ...createFileRow(), filename } },
        target,
      })
      await fireEvent.mouseOver(getByText(filename))

      await waitFor(() => {
        expect(
          target.querySelector(".spectrum-Tooltip.unclamped")
        ).toHaveTextContent(filename)
      })
    } finally {
      target.remove()
    }
  })
})
