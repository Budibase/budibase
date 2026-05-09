import { fireEvent, render, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/stores/builder", async () => {
  const { writable } = await import("svelte/store")
  const state = writable({ isResizingPanel: false })

  return {
    builderStore: {
      subscribe: state.subscribe,
      setResizingPanel: (isResizing: boolean) =>
        state.update(current => ({ ...current, isResizingPanel: isResizing })),
    },
  }
})

import ResizablePanel from "./ResizablePanel.svelte"

const setInnerWidth = (value: number) => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value,
  })
}

const setClientWidth = (el: HTMLElement, value: number) => {
  Object.defineProperty(el, "clientWidth", {
    configurable: true,
    value,
  })
}

describe("ResizablePanel", () => {
  beforeEach(() => {
    localStorage.clear()
    setInnerWidth(1200)
  })

  it("resizes with drag and persists clamped width", async () => {
    const onResizeStart = vi.fn()
    const { container, getByRole } = render(ResizablePanel, {
      storageKey: "panel-width",
      defaultWidth: 400,
      minWidth: 250,
      maxWidthRatio: 0.6,
      onResizeStart,
    })

    const panel = container.querySelector(".resizable-panel") as HTMLElement
    const resizeHandle = getByRole("separator")
    setClientWidth(panel, 400)

    await fireEvent.mouseDown(resizeHandle, { clientX: 400, detail: 1 })
    expect(onResizeStart).toHaveBeenCalledTimes(1)
    expect(panel).toHaveClass("resizing-panel")

    await fireEvent.mouseMove(window, { clientX: 100 })
    await fireEvent.mouseUp(window, { clientX: 100 })

    await waitFor(() => {
      expect(panel).toHaveStyle("width: 250px")
    })
    expect(panel).not.toHaveClass("resizing-panel")
    expect(localStorage.getItem("panel-width")).toBe("250")
  })

  it("recomputes max width on window resize and clamps current width", async () => {
    const { container } = render(ResizablePanel, {
      defaultWidth: 500,
      minWidth: 250,
      maxWidthRatio: 0.8,
    })

    const panel = container.querySelector(".resizable-panel") as HTMLElement

    await waitFor(() => {
      expect(panel).toHaveStyle("width: 500px")
      expect(panel).toHaveStyle("max-width: 960px")
    })

    setInnerWidth(500)
    window.dispatchEvent(new Event("resize"))

    await waitFor(() => {
      expect(panel).toHaveStyle("max-width: 400px")
      expect(panel).toHaveStyle("width: 400px")
    })
  })

  it("uses window.innerWidth when max constraints are not provided", async () => {
    const { container } = render(ResizablePanel, {
      defaultWidth: 300,
      minWidth: 250,
    })

    const panel = container.querySelector(".resizable-panel") as HTMLElement

    await waitFor(() => {
      expect(panel).toHaveStyle("max-width: 1200px")
      expect(panel).toHaveStyle("width: 300px")
    })

    setInnerWidth(640)
    window.dispatchEvent(new Event("resize"))

    await waitFor(() => {
      expect(panel).toHaveStyle("max-width: 640px")
      expect(panel).toHaveStyle("width: 300px")
    })
  })

  it("enforces minWidth when computed candidate max is smaller", async () => {
    const { container } = render(ResizablePanel, {
      defaultWidth: 300,
      minWidth: 250,
      maxWidth: 100,
      maxWidthRatio: 0.1,
    })

    const panel = container.querySelector(".resizable-panel") as HTMLElement

    await waitFor(() => {
      expect(panel).toHaveStyle("max-width: 250px")
      expect(panel).toHaveStyle("width: 250px")
    })
  })
})
