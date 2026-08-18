import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi, beforeEach } from "vitest"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockButton from "@/test/mocks/MockButton.svelte"
import MockComponent from "@/test/mocks/MockComponent.svelte"
import MockControllableModal from "@/test/mocks/MockControllableModal.svelte"
import MockInput from "@/test/mocks/MockInput.svelte"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"

const mocks = vi.hoisted(() => {
  const { writable } = require("svelte/store")
  return {
    goto: vi.fn(),
    createAgentOperation: vi.fn(),
    updateAgentOperation: vi.fn(),
    deleteAgentOperation: vi.fn(),
    fetchDeployment: vi.fn(),
    selectedAgent: writable({
      _id: "agent-1",
      name: "Support agent",
      aiconfig: "config-1",
      operations: [],
    }),
  }
})

vi.mock("@budibase/bbui", () => ({
  Body: MockBody,
  Button: MockButton,
  Helpers: { uuid: () => "123" },
  Icon: MockComponent,
  Input: MockInput,
  keepOpen: Symbol("keepOpen"),
  Modal: MockControllableModal,
  ModalContent: MockModalContent,
  notifications: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock("@/helpers/confirm", () => ({
  confirm: vi.fn(),
}))

vi.mock("@/stores/builder", () => ({
  contextMenuStore: {
    open: vi.fn(),
  },
  workspaceDeploymentStore: {
    fetch: mocks.fetchDeployment,
  },
}))

vi.mock("@/stores/portal", () => ({
  agentsStore: {
    createAgentOperation: mocks.createAgentOperation,
    updateAgentOperation: mocks.updateAgentOperation,
    deleteAgentOperation: mocks.deleteAgentOperation,
  },
  selectedAgent: mocks.selectedAgent,
}))

vi.mock("./OperationLiveBadge.svelte", () => ({
  default: MockComponent,
}))

vi.mock("@roxi/routify", async () => {
  const { writable } = await import("svelte/store")
  return { goto: writable(mocks.goto) }
})

import OperationsSection from "./OperationsSection.svelte"

describe("OperationsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("opens a create modal before adding an operation", async () => {
    mocks.selectedAgent.set({
      _id: "agent-1",
      name: "Support agent",
      aiconfig: "config-1",
      operations: [],
    })
    mocks.createAgentOperation.mockResolvedValue({
      _id: "agent-1",
      operations: [
        {
          id: "operation_123",
          name: "Customer support",
          live: false,
          allowKnowledgeSourceDownload: true,
        },
      ],
    })

    render(OperationsSection, {
      props: {
        agentId: "agent-1",
      },
    })

    expect(screen.queryByText("New operation")).not.toBeInTheDocument()

    await fireEvent.click(screen.getByText("Add operation"))

    expect(screen.getByText("New operation")).toBeInTheDocument()

    await fireEvent.input(screen.getByLabelText("Name"), {
      target: { value: "Customer support" },
    })
    await fireEvent.click(screen.getByText("Create"))

    expect(mocks.createAgentOperation).toHaveBeenCalledWith("agent-1", {
      id: "operation_123",
      name: "Customer support",
      live: false,
      promptInstructions: expect.stringContaining("**Operation role**"),
      allowKnowledgeSourceDownload: true,
    })
    expect(mocks.fetchDeployment).toHaveBeenCalled()
    expect(mocks.goto).toHaveBeenCalledWith("./operation/operation_123")
  })

  it("navigates to an operation when its row is selected", async () => {
    mocks.selectedAgent.set({
      _id: "agent-1",
      name: "Support agent",
      aiconfig: "config-1",
      operations: [
        {
          id: "operation_existing",
          name: "Customer support",
          live: false,
          promptInstructions: "Help the customer",
          allowKnowledgeSourceDownload: true,
        },
      ],
    })

    render(OperationsSection, {
      props: { agentId: "agent-1" },
    })

    await fireEvent.click(screen.getByText("Customer support"))

    expect(mocks.goto).toHaveBeenCalledWith("./operation/operation_existing")
  })

  it("does not allow creating a second operation with the same name", async () => {
    mocks.selectedAgent.set({
      _id: "agent-1",
      name: "Support agent",
      aiconfig: "config-1",
      operations: [
        {
          id: "operation_existing",
          name: "Customer support",
          live: false,
          promptInstructions: "",
          allowKnowledgeSourceDownload: true,
        },
      ],
    })

    render(OperationsSection, {
      props: {
        agentId: "agent-1",
      },
    })

    await fireEvent.click(screen.getByText("Add operation"))
    await fireEvent.input(screen.getByLabelText("Name"), {
      target: { value: "Customer support" },
    })

    expect(
      screen.getByText("An operation with this name already exists")
    ).toBeInTheDocument()
    expect(screen.getByText("Create")).toBeDisabled()

    expect(mocks.createAgentOperation).not.toHaveBeenCalled()
  })
})
