import { fireEvent, render, screen } from "@testing-library/svelte"
import { createRawSnippet } from "svelte"
import { describe, expect, it, vi } from "vitest"
import ActivityPanelShell from "./ActivityPanelShell.svelte"

const renderPanel = () =>
  render(ActivityPanelShell, {
    props: {
      open: true,
      title: "Session details",
      onClose: vi.fn(),
      children: createRawSnippet(() => ({
        render: () =>
          "<div><button>Retry</button><button disabled>Disabled</button><button hidden>Hidden</button></div>",
      })),
    },
  })

describe("ActivityPanelShell", () => {
  it("removes the panel and overlay when closed", async () => {
    const { container, rerender } = renderPanel()

    await rerender({ open: false, title: "" })

    expect(
      screen.queryByRole("dialog", { hidden: true })
    ).not.toBeInTheDocument()
    expect(container.querySelector(".activity-panel-overlay")).toBeNull()
  })

  it("exposes a modal dialog and moves initial Tab to its first control", async () => {
    renderPanel()
    const dialog = screen.getByRole("dialog")

    await fireEvent.keyDown(dialog, { key: "Tab" })

    expect(dialog).toHaveAttribute("aria-modal", "true")
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus()
  })

  it("wraps Tab from the last enabled, visible control to the first", async () => {
    renderPanel()
    const retry = screen.getByRole("button", { name: "Retry" })
    retry.focus()

    await fireEvent.keyDown(retry, { key: "Tab" })

    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus()
  })

  it("wraps Shift+Tab from the first control to the last", async () => {
    renderPanel()
    const close = screen.getByRole("button", { name: "Close" })
    close.focus()

    await fireEvent.keyDown(close, { key: "Tab", shiftKey: true })

    expect(screen.getByRole("button", { name: "Retry" })).toHaveFocus()
  })

  it("moves initial Shift+Tab to the last control", async () => {
    renderPanel()

    await fireEvent.keyDown(screen.getByRole("dialog"), {
      key: "Tab",
      shiftKey: true,
    })

    expect(screen.getByRole("button", { name: "Retry" })).toHaveFocus()
  })

  it("restores focus to the opener when closed", async () => {
    const opener = document.createElement("button")
    document.body.append(opener)
    opener.focus()
    const { rerender } = renderPanel()

    try {
      await rerender({ open: false })

      expect(opener).toHaveFocus()
    } finally {
      opener.remove()
    }
  })
})
