import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { readable } from "svelte/store"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MockActionButton from "@/test/mocks/MockActionButton.svelte"
import MockButton from "@/test/mocks/MockButton.svelte"
import MockInput from "@/test/mocks/MockInput.svelte"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"
import MockSlot from "@/test/mocks/MockSlot.svelte"

const mocks = vi.hoisted(() => ({
  createRowAction: vi.fn(),
  goto: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
}))

vi.mock("@budibase/bbui", () => ({
  ActionButton: MockActionButton,
  List: MockSlot,
  ListItem: MockSlot,
  Button: MockButton,
  Toggle: MockSlot,
  Modal: MockSlot,
  ModalContent: MockModalContent,
  Input: MockInput,
  notifications: { success: mocks.success, error: mocks.error },
}))
vi.mock("@/components/common/DetailPopover.svelte", () => ({
  default: MockSlot,
}))
vi.mock("@/stores/builder", async () => {
  const { readable } = await import("svelte/store")
  return {
    workspaceStore: readable({ appId: "app_1" }),
    rowActions: Object.assign(readable({}), {
      createRowAction: mocks.createRowAction,
    }),
  }
})
vi.mock("@roxi/routify", async () => {
  const { getContext } = await import("svelte")
  const { readable } = await import("svelte/store")
  return {
    goto: readable(mocks.goto),
    url: {
      subscribe: (listener: (helper: (path: string) => string) => void) => {
        getContext("grid")
        listener(path => path)
        return () => {}
      },
    },
  }
})

import GridRowActionsButton from "./GridRowActionsButton.svelte"

describe("row action creation navigation", () => {
  beforeEach(() => vi.clearAllMocks())

  it("opens the first created action without subscribing to route context after initialization", async () => {
    mocks.createRowAction.mockResolvedValue({ automationId: "automation_1" })
    render(GridRowActionsButton, {
      context: new Map([
        [
          "grid",
          {
            datasource: readable({
              tableId: "table_1",
              id: "table_1",
              type: "table",
            }),
          },
        ],
      ]),
    })
    await fireEvent.input(screen.getByLabelText("Name"), {
      target: { value: "Approve" },
    })
    await fireEvent.click(
      screen.getByRole("button", { name: "Create", exact: true })
    )

    await waitFor(() =>
      expect(mocks.goto).toHaveBeenCalledWith(
        "/builder/workspace/app_1/automation/automation_1"
      )
    )
    expect(mocks.createRowAction).toHaveBeenCalledWith(
      "table_1",
      "table_1",
      "Approve"
    )
    expect(mocks.success).toHaveBeenCalledWith(
      "Row action created successfully"
    )
    expect(mocks.error).not.toHaveBeenCalled()
  })
})
