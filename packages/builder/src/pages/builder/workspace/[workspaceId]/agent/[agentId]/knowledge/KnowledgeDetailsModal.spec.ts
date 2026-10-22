import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/svelte"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { KnowledgeBaseFileStatus } from "@budibase/types"
import { get } from "svelte/store"
import { agentsStore } from "@/stores/portal"
import { createKnowledgeFile, seedKnowledge } from "./testUtils"
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

const initialAgentState = get(agentsStore)

beforeEach(() => seedKnowledge())

afterEach(() => {
  agentsStore.set(initialAgentState)
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

  it("shows the pre-sync empty state and supports SharePoint actions", async () => {
    const row = createSharePointRow()
    const onEdit = vi.fn(async () => {})
    const { component } = render(KnowledgeDetailsModal, {
      target: renderModal(),
      props: { row, agentId: "agent-1", operationId: "operation-1", onEdit },
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
  it("shows only the selected SharePoint source's synced content", async () => {
    seedKnowledge({
      files: [
        createKnowledgeFile({ sourceId: "source-1" }),
        createKnowledgeFile({
          filename: "other-site-policy.txt",
          sourceId: "source-2",
          siteId: "site-2",
        }),
        createKnowledgeFile({ filename: "uploaded-notes.txt" }),
      ],
    })
    const { component } = render(KnowledgeDetailsModal, {
      target: renderModal(),
      props: {
        row: {
          ...createSharePointRow(),
          hasSynced: true,
          displayStatus: "1/1 ready",
          syncedCount: 1,
          totalCount: 1,
        },
        agentId: "agent-1",
        operationId: "operation-1",
        onEdit: async () => {},
      },
    })
    component.show()
    await screen.findByRole("dialog")

    expect(screen.getByText("support-policy.txt")).toBeVisible()
    expect(screen.getByText("Ready")).toBeVisible()
    expect(screen.queryByText("other-site-policy.txt")).toBeNull()
    expect(screen.queryByText("uploaded-notes.txt")).toBeNull()
    expect(
      screen.queryByText(
        "This SharePoint site does not contain synced content."
      )
    ).toBeNull()
  })
})
