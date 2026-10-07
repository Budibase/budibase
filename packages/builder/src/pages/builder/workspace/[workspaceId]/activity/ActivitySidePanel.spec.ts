import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { Agent, AgentRequest } from "@budibase/types"
import type { Writable } from "svelte/store"

const agentsStore: Writable<{
  agents: Pick<Agent, "_id" | "operations">[]
}> = vi.hoisted(() => {
  const { writable } = require("svelte/store")
  return writable({ agents: [] })
})

vi.mock("@/stores/portal", async importOriginal => ({
  ...(await importOriginal<typeof import("@/stores/portal")>()),
  agentsStore,
}))

import ActivitySidePanel from "./ActivitySidePanel.svelte"

const request: AgentRequest = {
  _id: "request-1",
  agentId: "agent_1",
  operationId: "operation_1",
  userId: "user-1",
  status: "needs_input",
  createdAt: "2026-10-05T11:00:00.000Z",
  entries: [
    {
      sessionId: "session-1",
      source: "Slack",
      createdAt: "2026-10-05T11:00:00.000Z",
      updatedAt: "2026-10-05T11:05:00.000Z",
      status: "needs_input",
    },
  ],
  actions: [
    {
      id: "action-1",
      type: "user_message",
      summary: "Restock item 42",
      timestamp: "2026-10-05T11:01:00.000Z",
    },
  ],
}

const renderPanel = (onClose = vi.fn()) =>
  render(ActivitySidePanel, {
    props: {
      open: true,
      title: "Restock request",
      request,
      agentName: "Support agent",
      createdBy: "Jane Doe",
      onClose,
    },
  })

describe("ActivitySidePanel", () => {
  beforeEach(() => {
    setOperation("Update inventory")
  })
  it("renders the request details and timeline", () => {
    renderPanel()

    const panel = within(
      document.querySelector<HTMLElement>(".activity-panel-container")!
    )
    expect(panel.getByText("Restock request")).toBeInTheDocument()
    expect(panel.getByText("Needs input")).toBeInTheDocument()
    expect(panel.getByText("Support agent")).toBeInTheDocument()
    expect(panel.getByText("Update inventory")).toBeInTheDocument()
    expect(panel.getByText("Jane Doe")).toBeInTheDocument()
    expect(panel.getByText("Slack")).toBeInTheDocument()
    expect(panel.getByText("Restock item 42")).toBeInTheDocument()
  })

  it("closes when clicking outside the panel", async () => {
    const onClose = vi.fn()
    renderPanel(onClose)

    await fireEvent.click(
      document.querySelector<HTMLElement>(".activity-panel-overlay")!
    )

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("is exposed as a focused dialog named after its title", async () => {
    renderPanel()

    const dialog = screen.getByRole("dialog", { name: "Restock request" })
    await waitFor(() => {
      expect(dialog).toHaveFocus()
    })
  })

  it("closes with the close button and the Escape key", async () => {
    const onClose = vi.fn()
    renderPanel(onClose)

    await fireEvent.click(screen.getByRole("button", { name: "Close" }))
    await fireEvent.keyDown(window, { key: "Escape" })

    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it("ignores Escape while closed", async () => {
    const onClose = vi.fn()
    render(ActivitySidePanel, {
      props: {
        open: false,
        title: "Restock request",
        request,
        agentName: "Support agent",
        createdBy: "Jane Doe",
        onClose,
      },
    })

    await fireEvent.keyDown(window, { key: "Escape" })

    expect(onClose).not.toHaveBeenCalled()
  })

  it("renders nothing without a request", () => {
    render(ActivitySidePanel, {
      props: {
        open: true,
        title: "Request",
        request: undefined,
        agentName: "Unknown agent",
        createdBy: "Unknown user",
        onClose: vi.fn(),
      },
    })

    expect(screen.queryByText("Request details")).not.toBeInTheDocument()
  })
})

const setOperation = (name: string) => {
  agentsStore.set({
    agents: [
      {
        _id: "agent_1",
        operations: [
          {
            id: "operation_1",
            name,
            live: true,
            allowKnowledgeSourceDownload: false,
          },
        ],
      },
    ],
  })
}

const renderRequest = ({
  operationId = "operation_1",
}: { operationId?: string | null } = {}) => {
  const request: AgentRequest = {
    _id: "agentrequest_1",
    agentId: "agent_1",
    ...(operationId ? { operationId } : {}),
    userId: "user_1",
    status: "needs_input",
    entries: [
      {
        sessionId: "session_1",
        source: "Chat",
        status: "needs_input",
        createdAt: "2026-10-06T10:00:00.000Z",
        updatedAt: "2026-10-06T10:00:00.000Z",
      },
    ],
  }
  return render(ActivitySidePanel, {
    open: true,
    title: "Buy some chips",
    request,
    agentName: "Purchasing agent",
    createdBy: "Requester",
    onClose: vi.fn(),
  })
}

describe("ActivitySidePanel operation name", () => {
  beforeEach(() => {
    setOperation("Expenses")
  })

  it("shows a renamed operation on an existing request", async () => {
    renderRequest()
    setOperation("Purchases")

    await waitFor(() => {
      expect(screen.getByText("Purchases")).toBeInTheDocument()
      expect(screen.queryByText("Expenses")).not.toBeInTheDocument()
    })
  })

  it("does not label a legacy request without an operation ID as deleted", () => {
    renderRequest({ operationId: null })
    expect(screen.queryByText("Deleted operation")).not.toBeInTheDocument()
    expect(
      screen
        .getByText("Operation")
        .parentElement?.querySelector(".detail-text")
        ?.textContent?.trim()
    ).toBe("")
  })

  it("does not label an operation as deleted when the agent is unavailable", () => {
    agentsStore.set({ agents: [] })
    renderRequest()
    expect(screen.queryByText("Deleted operation")).not.toBeInTheDocument()
    expect(
      screen
        .getByText("Operation")
        .parentElement?.querySelector(".detail-text")
        ?.textContent?.trim()
    ).toBe("")
  })

  it("shows a deleted operation without retaining its old name", async () => {
    renderRequest()
    agentsStore.set({ agents: [{ _id: "agent_1", operations: [] }] })

    await waitFor(() => {
      expect(screen.getByText("Deleted operation")).toBeInTheDocument()
      expect(screen.queryByText("Expenses")).not.toBeInTheDocument()
    })
  })
})
