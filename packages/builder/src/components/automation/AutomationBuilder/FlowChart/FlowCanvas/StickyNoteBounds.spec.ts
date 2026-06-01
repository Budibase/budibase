import { describe, expect, it } from "vitest"
import {
  MIN_STICKY_NOTE_HEIGHT,
  MIN_STICKY_NOTE_WIDTH,
  clampStickyNoteToGraphBounds,
  clampStickyNoteToViewportBounds,
} from "./StickyNoteBounds"

describe("StickyNoteBounds", () => {
  const nodeBounds = {
    x: 0,
    y: 0,
    width: 500,
    height: 500,
  }

  it("keeps the default sticky note position when it is inside the drag boundary", () => {
    expect(
      clampStickyNoteToGraphBounds({ x: 250, y: 320 }, nodeBounds, {
        width: MIN_STICKY_NOTE_WIDTH,
        height: MIN_STICKY_NOTE_HEIGHT,
      })
    ).toEqual({ x: 250, y: 320 })
  })

  it("moves a new sticky note to the nearest boundary edge", () => {
    expect(
      clampStickyNoteToGraphBounds({ x: 250, y: 1200 }, nodeBounds, {
        width: MIN_STICKY_NOTE_WIDTH,
        height: MIN_STICKY_NOTE_HEIGHT,
      })
    ).toEqual({ x: 250, y: 900 })
  })

  it("keeps a new sticky note inside the visible viewport after graph clamping", () => {
    const graphPosition = clampStickyNoteToGraphBounds(
      { x: 250, y: 1200 },
      nodeBounds,
      {
        width: MIN_STICKY_NOTE_WIDTH,
        height: MIN_STICKY_NOTE_HEIGHT,
      }
    )

    expect(
      clampStickyNoteToViewportBounds(
        graphPosition,
        { x: 0, y: 0, zoom: 1 },
        { width: 700, height: 700 },
        {
          width: MIN_STICKY_NOTE_WIDTH,
          height: MIN_STICKY_NOTE_HEIGHT,
        }
      )
    ).toEqual({ x: 250, y: 560 })
  })
})
