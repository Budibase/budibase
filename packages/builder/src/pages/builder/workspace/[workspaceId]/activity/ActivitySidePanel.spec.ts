import { render, screen, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { Writable } from "svelte/store"
import type { Agent, AgentRequest } from "@budibase/types"
import MockComponent from "@/test/mocks/MockComponent.svelte"

const agentsStore: Writable<{
  agents: Pick<Agent, "_id" | "operations">[]
}> = vi.hoisted(() => {
  const { writable } = require("svelte/store")
  return writable({ agents: [] })
})

vi.mock("@/stores/portal", () => ({ agentsStore }))
vi.mock("@budibase/bbui", () => ({ Icon: MockComponent }))
vi.mock("@/components/common/ResizablePanel.svelte", () => ({
  default: MockComponent,
}))
vi.mock("@/components/design/Panel.svelte", () => ({
  default: MockComponent,
}))

vi.mock("./ActivityStatusBadge.svelte", () => ({ default: MockComponent }))

import ActivitySidePanel from "./ActivitySidePanel.svelte"

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

const renderRequest = () => {
  const request: AgentRequest = {
    _id: "agentrequest_1",
    agentId: "agent_1",
    operationId: "operation_1",
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

  it("shows a deleted operation without retaining its old name", async () => {
    renderRequest()
    agentsStore.set({ agents: [{ _id: "agent_1", operations: [] }] })

    await waitFor(() => {
      expect(screen.getByText("Deleted operation")).toBeInTheDocument()
      expect(screen.queryByText("Expenses")).not.toBeInTheDocument()
    })
  })
})
