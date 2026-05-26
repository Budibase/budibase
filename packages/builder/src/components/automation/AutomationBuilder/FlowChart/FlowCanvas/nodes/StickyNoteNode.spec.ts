import { fireEvent, render, waitFor } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import MockIcon from "@/test/mocks/MockIcon.svelte"

const mocks = vi.hoisted(() => ({
  updateStickyNote: vi.fn(),
}))

vi.mock("@/stores/builder", () => ({
  automationStore: {
    subscribe: (run: (state: { viewMode: string }) => void) => {
      run({ viewMode: "editor" })
      return () => {}
    },
    actions: {
      updateStickyNote: mocks.updateStickyNote,
      updateStickyNotePosition: vi.fn(),
      removeStickyNote: vi.fn(),
    },
  },
}))

vi.mock("@budibase/bbui", () => ({
  Icon: MockIcon,
}))

vi.mock("@xyflow/svelte", () => ({
  useSvelteFlow: () => ({
    getNodes: () => [],
    getViewport: () => ({ zoom: 1 }),
    updateNode: vi.fn(),
  }),
}))

import StickyNoteNode from "./StickyNoteNode.svelte"

const setTextareaSize = (
  textarea: HTMLTextAreaElement,
  size: { clientHeight: number; contentHeight: number }
) => {
  Object.defineProperty(textarea, "clientHeight", {
    configurable: true,
    value: size.clientHeight,
  })
  Object.defineProperty(textarea, "scrollHeight", {
    configurable: true,
    get: () =>
      textarea.style.height === "0px" && textarea.style.minHeight === "0px"
        ? size.contentHeight
        : Math.max(size.clientHeight, size.contentHeight),
  })
}

describe("StickyNoteNode", () => {
  it("shrinks the note height when text no longer needs the expanded height", async () => {
    const { container } = render(StickyNoteNode, {
      props: {
        data: {
          note: {
            id: "note-1",
            title: "Note",
            text: "Line one",
            x: 0,
            y: 0,
            height: 140,
          },
        },
      },
    })

    const note = container.querySelector(".sticky-note") as HTMLElement
    const noteBody = container.querySelector(".note-body") as HTMLElement

    await fireEvent.mouseDown(noteBody)
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement

    setTextareaSize(textarea, { clientHeight: 80, contentHeight: 98 })
    await fireEvent.input(textarea, {
      target: { value: "Line one\nLine two" },
    })

    await waitFor(() => {
      expect(note).toHaveStyle("height: 158px")
    })

    setTextareaSize(textarea, { clientHeight: 98, contentHeight: 80 })
    await fireEvent.input(textarea, {
      target: { value: "Line one" },
    })

    await waitFor(() => {
      expect(note).toHaveStyle("height: 140px")
    })
  })
})
