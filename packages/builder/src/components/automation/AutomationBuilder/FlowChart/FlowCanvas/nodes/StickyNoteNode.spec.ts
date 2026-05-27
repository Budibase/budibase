import { fireEvent, render, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MockIcon from "@/test/mocks/MockIcon.svelte"

const mocks = vi.hoisted(() => ({
  updateStickyNote: vi.fn(),
  updateStickyNotePosition: vi.fn(),
  flowNodes: [] as Array<{ id: string; position: { x: number; y: number } }>,
  updateNode: vi.fn(
    (id: string, updates: { position?: { x: number; y: number } }) => {
      const node = mocks.flowNodes.find(n => n.id === id)
      if (node && updates.position) {
        node.position = updates.position
      }
    }
  ),
}))

vi.mock("@/stores/builder", () => ({
  automationStore: {
    subscribe: (run: (state: { viewMode: string }) => void) => {
      run({ viewMode: "editor" })
      return () => {}
    },
    actions: {
      updateStickyNote: mocks.updateStickyNote,
      updateStickyNotePosition: mocks.updateStickyNotePosition,
      removeStickyNote: vi.fn(),
    },
  },
}))

vi.mock("@budibase/bbui", () => ({
  Icon: MockIcon,
}))

vi.mock("@xyflow/svelte", () => ({
  useSvelteFlow: () => ({
    getNodes: () => mocks.flowNodes,
    getViewport: () => ({ zoom: 1 }),
    updateNode: mocks.updateNode,
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

const dispatchPointerEvent = (
  target: EventTarget,
  type: string,
  position: { clientX: number; clientY: number }
) => {
  const event = new Event(type, { bubbles: true })
  Object.defineProperty(event, "clientX", { value: position.clientX })
  Object.defineProperty(event, "clientY", { value: position.clientY })
  target.dispatchEvent(event)
}

const dispatchMouseDown = (
  target: EventTarget,
  position: { clientX: number; clientY: number; detail?: number }
) => {
  target.dispatchEvent(
    new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      clientX: position.clientX,
      clientY: position.clientY,
      detail: position.detail || 1,
    })
  )
}

describe("StickyNoteNode", () => {
  beforeEach(() => {
    mocks.updateStickyNote.mockReset()
    mocks.updateStickyNotePosition.mockReset()
    mocks.updateNode.mockClear()
    mocks.flowNodes = []
  })

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

  it("allows native text selection to start on mouse down", () => {
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

    const title = container.querySelector(".title-input") as HTMLInputElement
    const text = container.querySelector(".text-input") as HTMLTextAreaElement
    const titleMouseDown = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
    })
    const textMouseDown = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      detail: 1,
    })

    title.dispatchEvent(titleMouseDown)
    text.dispatchEvent(textMouseDown)

    expect(titleMouseDown.defaultPrevented).toBe(false)
    expect(textMouseDown.defaultPrevented).toBe(false)
  })

  it("saves active text edits with the dragged position", async () => {
    mocks.flowNodes = [
      {
        id: "note-1",
        position: { x: 0, y: 0 },
      },
    ]
    mocks.updateStickyNote.mockImplementation(async () => {
      mocks.flowNodes[0].position = { x: 0, y: 0 }
    })

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

    const noteBody = container.querySelector(".note-body") as HTMLElement
    await fireEvent.mouseDown(noteBody)
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement
    await fireEvent.input(textarea, {
      target: { value: "Updated text" },
    })

    const dragGrip = container.querySelector(".drag-grip") as HTMLElement
    dispatchPointerEvent(dragGrip, "pointerdown", {
      clientX: 10,
      clientY: 20,
    })
    dispatchPointerEvent(document, "pointermove", {
      clientX: 70,
      clientY: 90,
    })
    dispatchPointerEvent(document, "pointerup", {
      clientX: 70,
      clientY: 90,
    })

    await waitFor(() => {
      expect(mocks.updateStickyNote).toHaveBeenCalledWith("note-1", {
        text: "Updated text",
        height: 140,
        x: 60,
        y: 70,
      })
      expect(mocks.updateStickyNotePosition).not.toHaveBeenCalled()
    })
  })

  it("keeps the dropped position visible while saving the drag", async () => {
    let resolveSave: () => void
    mocks.updateStickyNotePosition.mockImplementation(
      () =>
        new Promise<void>(resolve => {
          resolveSave = resolve
        })
    )

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

    const portal = container.querySelector(".sticky-note-portal") as HTMLElement
    const dragGrip = container.querySelector(".drag-grip") as HTMLElement

    dispatchPointerEvent(dragGrip, "pointerdown", {
      clientX: 10,
      clientY: 20,
    })
    dispatchPointerEvent(document, "pointermove", {
      clientX: 70,
      clientY: 90,
    })
    dispatchPointerEvent(document, "pointerup", {
      clientX: 70,
      clientY: 90,
    })

    await waitFor(() => {
      expect(portal).toHaveStyle("transform: translate(60px, 70px)")
    })

    resolveSave!()

    await waitFor(() => {
      expect(mocks.updateStickyNotePosition).toHaveBeenCalledWith("note-1", {
        x: 60,
        y: 70,
      })
      expect(portal).toHaveStyle("transform: translate(60px, 70px)")
    })
  })

  it("saves active text edits with the resized width", async () => {
    mocks.flowNodes = [
      {
        id: "note-1",
        position: { x: 0, y: 0 },
      },
    ]

    const { container } = render(StickyNoteNode, {
      props: {
        data: {
          note: {
            id: "note-1",
            title: "Note",
            text: "Line one",
            x: 0,
            y: 0,
            width: 220,
            height: 140,
          },
        },
      },
    })

    const noteBody = container.querySelector(".note-body") as HTMLElement
    await fireEvent.mouseDown(noteBody)
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement
    await fireEvent.input(textarea, {
      target: { value: "Updated text" },
    })

    const resizeGrip = container.querySelector(".resize-grip") as HTMLElement
    dispatchPointerEvent(resizeGrip, "pointerdown", {
      clientX: 100,
      clientY: 20,
    })
    dispatchPointerEvent(document, "pointermove", {
      clientX: 160,
      clientY: 20,
    })
    dispatchPointerEvent(document, "pointerup", {
      clientX: 160,
      clientY: 20,
    })

    await waitFor(() => {
      expect(mocks.updateStickyNote).toHaveBeenCalledWith("note-1", {
        text: "Updated text",
        width: 280,
        height: 140,
      })
    })
    expect(mocks.updateStickyNotePosition).not.toHaveBeenCalled()
  })

  it("allows text selection even when the mouse leaves the card boundary", async () => {
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

    const textarea = container.querySelector(".text-input") as HTMLTextAreaElement
    const note = container.querySelector(".sticky-note") as HTMLElement
    const clearSelection = vi.fn(() => {
      textarea.setSelectionRange(0, 0)
    })
    const canvasPointerDown = vi.fn()
    const textMouseDown = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
    })

    document.body.addEventListener("pointerdown", canvasPointerDown)
    document.body.addEventListener("pointermove", clearSelection)

    textarea.setSelectionRange(4, 8)
    await fireEvent.select(textarea)
    dispatchPointerEvent(textarea, "pointerdown", {
      clientX: 100,
      clientY: 40,
    })
    textarea.dispatchEvent(textMouseDown)
    await waitFor(() => {
      expect(document.body).toHaveClass("sticky-note-selecting-text")
      expect(note).toHaveClass("selecting-text")
    })
    dispatchPointerEvent(document.body, "pointermove", {
      clientX: -10,
      clientY: 40,
    })
    textarea.setSelectionRange(8, 8)

    expect(textMouseDown.defaultPrevented).toBe(false)
    expect(canvasPointerDown).not.toHaveBeenCalled()
    expect(clearSelection).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(textarea.selectionStart).toBe(4)
      expect(textarea.selectionEnd).toBe(8)
    })

    dispatchPointerEvent(document.body, "pointerup", {
      clientX: -10,
      clientY: 40,
    })
    dispatchPointerEvent(document.body, "pointermove", {
      clientX: -20,
      clientY: 40,
    })

    expect(clearSelection).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(document.body).not.toHaveClass("sticky-note-selecting-text")
      expect(note).not.toHaveClass("selecting-text")
    })

    document.body.removeEventListener("pointerdown", canvasPointerDown)
    document.body.removeEventListener("pointermove", clearSelection)
  })

  it("allows selected text to be deselected with a single click after selection ends", async () => {
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

    const textarea = container.querySelector(".text-input") as HTMLTextAreaElement
    const canvasClick = vi.fn()

    document.body.addEventListener("click", canvasClick)

    textarea.setSelectionRange(4, 8)
    textarea.dispatchEvent(new Event("select", { bubbles: true }))
    dispatchPointerEvent(textarea, "pointerdown", {
      clientX: 100,
      clientY: 40,
    })
    dispatchMouseDown(textarea, {
      clientX: 100,
      clientY: 40,
    })
    dispatchPointerEvent(document.body, "pointerup", {
      clientX: 100,
      clientY: 40,
    })

    await waitFor(() => {
      expect(document.body).not.toHaveClass("sticky-note-selecting-text")
    })

    textarea.setSelectionRange(8, 8)
    await fireEvent.click(document.body)

    expect(canvasClick).toHaveBeenCalledTimes(1)
    expect(textarea.selectionStart).toBe(8)
    expect(textarea.selectionEnd).toBe(8)

    document.body.removeEventListener("click", canvasClick)
  })

  it("does not select the title text when clicking the title after selecting note text", async () => {
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

    const title = container.querySelector(".title-input") as HTMLInputElement
    const textarea = container.querySelector(".text-input") as HTMLTextAreaElement

    textarea.setSelectionRange(4, 8)
    textarea.dispatchEvent(new Event("select", { bubbles: true }))
    dispatchPointerEvent(textarea, "pointerdown", {
      clientX: 100,
      clientY: 40,
    })
    dispatchMouseDown(textarea, {
      clientX: 100,
      clientY: 40,
    })
    dispatchPointerEvent(document.body, "pointerup", {
      clientX: 100,
      clientY: 40,
    })

    await waitFor(() => {
      expect(document.body).not.toHaveClass("sticky-note-selecting-text")
    })

    dispatchPointerEvent(title, "pointerdown", {
      clientX: 70,
      clientY: 40,
    })
    dispatchMouseDown(title, {
      clientX: 70,
      clientY: 40,
    })
    title.setSelectionRange(0, 4)
    await fireEvent.select(title)
    dispatchPointerEvent(document.body, "pointerup", {
      clientX: 70,
      clientY: 40,
    })

    await waitFor(() => {
      expect(title.selectionStart).toBe(4)
      expect(title.selectionEnd).toBe(4)
    })
  })

  it("does not select description text when clicking it after selecting title text", async () => {
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

    const title = container.querySelector(".title-input") as HTMLInputElement
    const textarea = container.querySelector(".text-input") as HTMLTextAreaElement

    title.setSelectionRange(0, 4)
    await fireEvent.select(title)
    dispatchPointerEvent(title, "pointerdown", {
      clientX: 70,
      clientY: 40,
    })
    dispatchMouseDown(title, {
      clientX: 70,
      clientY: 40,
    })
    dispatchPointerEvent(document.body, "pointerup", {
      clientX: 70,
      clientY: 40,
    })

    await waitFor(() => {
      expect(document.body).not.toHaveClass("sticky-note-selecting-text")
    })

    dispatchPointerEvent(textarea, "pointerdown", {
      clientX: 70,
      clientY: 80,
    })
    dispatchMouseDown(textarea, {
      clientX: 70,
      clientY: 80,
    })
    textarea.setSelectionRange(0, 4)
    await fireEvent.select(textarea)
    dispatchPointerEvent(document.body, "pointerup", {
      clientX: 70,
      clientY: 80,
    })

    await waitFor(() => {
      expect(textarea.selectionStart).toBe(4)
      expect(textarea.selectionEnd).toBe(4)
    })
  })

  it("allows double clicking the title to select a word", async () => {
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

    const title = container.querySelector(".title-input") as HTMLInputElement

    dispatchPointerEvent(title, "pointerdown", {
      clientX: 70,
      clientY: 40,
    })
    dispatchMouseDown(title, {
      clientX: 70,
      clientY: 40,
      detail: 2,
    })
    title.setSelectionRange(0, 4)
    await fireEvent.select(title)
    dispatchPointerEvent(document.body, "pointerup", {
      clientX: 70,
      clientY: 40,
    })

    expect(title.selectionStart).toBe(0)
    expect(title.selectionEnd).toBe(4)
  })

  it("allows double clicking the description to select a word", async () => {
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

    const textarea = container.querySelector(".text-input") as HTMLTextAreaElement

    dispatchPointerEvent(textarea, "pointerdown", {
      clientX: 70,
      clientY: 80,
    })
    dispatchMouseDown(textarea, {
      clientX: 70,
      clientY: 80,
      detail: 2,
    })
    textarea.setSelectionRange(0, 4)
    await fireEvent.select(textarea)
    dispatchPointerEvent(document.body, "pointerup", {
      clientX: 70,
      clientY: 80,
    })

    expect(textarea.selectionStart).toBe(0)
    expect(textarea.selectionEnd).toBe(4)
  })
})
