import { fireEvent, render, screen } from "@testing-library/svelte"
import type { Agent } from "@budibase/types"
import { FeatureFlag } from "@budibase/types"
import { describe, expect, it, vi } from "vitest"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockButton from "@/test/mocks/MockButton.svelte"
import MockComponent from "@/test/mocks/MockComponent.svelte"
import MockControllableModal from "@/test/mocks/MockControllableModal.svelte"
import MockInput from "@/test/mocks/MockInput.svelte"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"

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
}))

const { featureFlagsStore } = vi.hoisted(() => {
  let value = {}
  const subscribers = new Set<(value: Record<string, boolean>) => void>()

  return {
    featureFlagsStore: {
      subscribe(callback: (value: Record<string, boolean>) => void) {
        subscribers.add(callback)
        callback(value)
        return () => subscribers.delete(callback)
      },
      set(nextValue: Record<string, boolean>) {
        value = nextValue
        subscribers.forEach(callback => callback(value))
      },
    },
  }
})

vi.mock("@/stores/portal", () => ({
  featureFlags: featureFlagsStore,
}))

vi.mock("./OperationLiveBadge.svelte", () => ({
  default: MockComponent,
}))

vi.mock("./OperationSidePanel.svelte", () => ({
  default: MockComponent,
}))

import OperationsSection from "./OperationsSection.svelte"

describe("OperationsSection", () => {
  it("opens a create modal before adding an operation", async () => {
    featureFlagsStore.set({})
    const onUpdated = vi.fn(async () => true)
    const agent: Agent = {
      name: "Support agent",
      aiconfig: "config-1",
      operations: [],
    }

    render(OperationsSection, {
      props: {
        agent,
        onUpdated,
      },
    })

    expect(screen.queryByText("New operation")).not.toBeInTheDocument()

    await fireEvent.click(screen.getByText("Add operation"))

    expect(screen.getByText("New operation")).toBeInTheDocument()
    expect(agent.operations).toHaveLength(0)

    await fireEvent.input(screen.getByLabelText("Name"), {
      target: { value: "Customer support" },
    })
    await fireEvent.click(screen.getByText("Create"))

    expect(onUpdated).toHaveBeenCalledTimes(1)
    expect(agent.operations).toHaveLength(1)
    expect(agent.operations[0]).toMatchObject({
      id: "operation_123",
      name: "Customer support",
      live: false,
    })
  })

  it("does not allow creating a second operation with the same name", async () => {
    featureFlagsStore.set({
      [FeatureFlag.MULTIPLE_OPERATIONS]: true,
    })
    const onUpdated = vi.fn(async () => true)
    const agent: Agent = {
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
    }

    render(OperationsSection, {
      props: {
        agent,
        onUpdated,
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

    expect(onUpdated).not.toHaveBeenCalled()
    expect(agent.operations).toHaveLength(1)
  })
})
