import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import RowSelectorHarness from "./RowSelectorHarness.svelte"

const mocks = vi.hoisted(() => {
  const createStore = <T>(initial: T) => ({
    subscribe: (run: (value: T) => void) => {
      run(initial)
      return () => {}
    },
  })

  return {
    tables: createStore({
      list: [
        {
          _id: "ta_employees",
          name: "Employees",
          schema: {
            Email: {
              type: "string",
            },
            Jobs: {
              type: "array",
            },
          },
        },
      ],
    }),
  }
})

vi.mock("@/stores/builder", () => ({
  tables: mocks.tables,
}))

vi.mock("@budibase/bbui", async () => {
  const { default: MockActionButton } = await import(
    "@/test/mocks/MockActionButton.svelte"
  )
  const { default: MockSlot } = await import("@/test/mocks/MockSlot.svelte")
  return {
    ActionButton: MockActionButton,
    ActionGroup: MockSlot,
    Button: MockActionButton,
    Helpers: { uuid: vi.fn(() => "test-session") },
    Icon: MockSlot,
    Label: MockSlot,
    Modal: MockSlot,
    ModalContent: MockSlot,
    Popover: MockSlot,
    TooltipPosition: {
      Left: "left",
    },
    TooltipType: {
      Info: "info",
    },
  }
})

vi.mock("@/components/common/bindings", async () => {
  const { default: MockSlot } = await import("@/test/mocks/MockSlot.svelte")
  return {
    DrawerBindableSlot: MockSlot,
    ServerBindingPanel: MockSlot,
  }
})

vi.mock("./RowSelectorTypes.svelte", async () => ({
  default: (await import("@/test/mocks/MockSlot.svelte")).default,
}))

describe("RowSelector", () => {
  it("clears selected fields when clearing the selected table", async () => {
    render(RowSelectorHarness, {
      props: {
        row: {
          tableId: "ta_employees",
          Email: "test@example.com",
          Jobs: ["Engineer"],
        },
        meta: {
          fields: {
            Email: {},
            Jobs: {},
          },
        },
      },
    })

    expect(screen.getAllByText("Email").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Jobs").length).toBeGreaterThan(0)

    await fireEvent.click(screen.getAllByRole("button", { name: "Clear" })[0])

    await waitFor(() => {
      expect(screen.queryByText("Email")).not.toBeInTheDocument()
    })
    expect(screen.queryByText("Jobs")).not.toBeInTheDocument()
  })

  it("shows all fields in the modal and toggles field visibility", async () => {
    render(RowSelectorHarness, {
      props: {
        row: {
          tableId: "ta_employees",
          Email: "test@example.com",
        },
        meta: {
          fields: {
            Email: {},
          },
        },
      },
    })

    expect(
      screen.getByRole("button", { name: "Hide Email" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Show Jobs" })
    ).toBeInTheDocument()

    await fireEvent.click(screen.getByRole("button", { name: "Hide Email" }))

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Show Email" })
      ).toBeInTheDocument()
    })
  })
})
