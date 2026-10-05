import { fireEvent, render, screen, within } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import type { AgentRequest } from "@budibase/types"
import ActivitySidePanel from "./ActivitySidePanel.svelte"

const request: AgentRequest = {
  _id: "request-1",
  agentId: "agent-1",
  userId: "user-1",
  status: "needs_input",
  createdAt: "2026-10-05T11:00:00.000Z",
  entries: [
    {
      sessionId: "session-1",
      source: "Slack",
      operationNames: ["Update inventory"],
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
