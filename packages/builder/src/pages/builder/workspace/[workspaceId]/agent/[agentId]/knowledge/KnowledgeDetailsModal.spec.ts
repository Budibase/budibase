import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/svelte"
import { afterEach, describe, expect, it, vi } from "vitest"
import { KnowledgeBaseFileStatus } from "@budibase/types"
import KnowledgeDetailsModal from "./KnowledgeDetailsModal.svelte"
import type {
  FileKnowledgeTableRow,
  SharePointConnectionTableRow,
} from "./renderers/types"

const createFileRow = (): FileKnowledgeTableRow => ({
  kind: "file",
  _id: "file-1",
  filename: "Support notes.txt",
  status: KnowledgeBaseFileStatus.FAILED,
  displayStatus: "Failed",
  size: "1 KB",
  updatedAt: "2026-01-01",
  errorMessage: "Upload rejected",
  canRetry: true,
  knowledgeSearchConfigured: true,
  onRetry: vi.fn(async () => {}),
  onDelete: vi.fn(async () => {}),
})

const createSharePointRow = (): SharePointConnectionTableRow => ({
  kind: "sharepoint_connection",
  _id: "site-1",
  siteId: "site-1",
  sourceId: "source-1",
  filename: "Support site",
  subtitle: "SharePoint",
  displayStatus: "Processing",
  syncedCount: 0,
  totalCount: 0,
  failedCount: 0,
  processingCount: 0,
  hasSynced: false,
  isSyncing: false,
  knowledgeSearchConfigured: true,
  onSync: vi.fn(async () => {}),
  onDelete: vi.fn(async () => {}),
})

const renderModal = () => {
  const target = document.createElement("div")
  target.className = "spectrum modal-container"
  document.body.appendChild(target)
  return target
}

afterEach(() => {
  cleanup()
  document.body.replaceChildren()
})

describe("KnowledgeDetailsModal", () => {
  it("shows file details and routes recovery actions to the selected file", async () => {
    const row = createFileRow()
    const { component } = render(KnowledgeDetailsModal, {
      target: renderModal(),
      props: { row, operationId: "operation-1", onEdit: async () => {} },
    })
    component.show()
    await screen.findByRole("dialog")
    await fireEvent.click(screen.getByRole("button", { name: /Retry$/ }))
    await waitFor(() => expect(row.onRetry).toHaveBeenCalledOnce())
    await fireEvent.click(screen.getByRole("button", { name: /Remove$/ }))

    expect(row.onDelete).toHaveBeenCalledOnce()
    expect(screen.getByRole("heading")).toHaveTextContent("Support notes.txt")
    expect(screen.getByText("Upload rejected")).toBeVisible()
    expect(screen.getByText("Size: 1 KB")).toBeVisible()
  })

  it("updates the status and available actions when the source changes", async () => {
    const row = createFileRow()
    const { component, rerender } = render(KnowledgeDetailsModal, {
      target: renderModal(),
      props: { row, operationId: "operation-1", onEdit: async () => {} },
    })
    component.show()
    await screen.findByRole("dialog")
    await rerender({
      row: {
        ...row,
        status: KnowledgeBaseFileStatus.PROCESSING,
        displayStatus: "Processing",
        errorMessage: undefined,
        canRetry: false,
      },
    })

    expect(screen.getByText("Processing")).toBeVisible()
    expect(screen.queryByRole("button", { name: /Retry$/ })).toBeNull()
    expect(screen.queryByText("Upload rejected")).toBeNull()
  })

  it("allows dismissing a rejected upload without knowledge search", async () => {
    const onDismiss = vi.fn()
    const { component } = render(KnowledgeDetailsModal, {
      target: renderModal(),
      props: {
        row: {
          ...createFileRow(),
          isRejected: true,
          knowledgeSearchConfigured: false,
          onDismiss,
        },
        operationId: "operation-1",
        onEdit: async () => {},
      },
    })
    component.show()
    await screen.findByRole("dialog")
    await fireEvent.click(screen.getByRole("button", { name: /Dismiss$/ }))

    expect(onDismiss).toHaveBeenCalledOnce()
    expect(screen.getByRole("button", { name: /Retry$/ })).toBeDisabled()
    expect(screen.queryByRole("button", { name: /Remove$/ })).toBeNull()
  })

  it("preserves SharePoint content and editing before the first sync", async () => {
    const row = createSharePointRow()
    const onEdit = vi.fn(async () => {})
    const { component } = render(KnowledgeDetailsModal, {
      target: renderModal(),
      props: { row, operationId: "operation-1", onEdit },
    })
    component.show()
    await screen.findByRole("dialog")
    await fireEvent.click(screen.getByRole("button", { name: /Sync$/ }))
    await waitFor(() => expect(row.onSync).toHaveBeenCalledOnce())
    await fireEvent.click(screen.getByRole("button", { name: /Disconnect$/ }))
    expect(row.onDelete).toHaveBeenCalledOnce()
    expect(
      screen.getByText("This SharePoint site does not contain synced content.")
    ).toBeVisible()
    await fireEvent.click(screen.getByRole("button", { name: "Edit files" }))

    expect(onEdit).toHaveBeenCalledWith("site-1")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
