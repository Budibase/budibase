import { describe, expect, it } from "vitest"
import {
  MAX_STICKY_NOTE_HEIGHT,
  MAX_STICKY_NOTE_WIDTH,
  MIN_STICKY_NOTE_HEIGHT,
  MIN_STICKY_NOTE_WIDTH,
  clampStickyNoteToGraphBounds,
  clampStickyNoteToViewportBounds,
  getBoundsOfFlowBounds,
  getStickyNoteBounds,
} from "../FlowCanvas/StickyNoteBounds"

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

  it("combines graph and sticky note bounds for viewport fitting", () => {
    expect(
      getBoundsOfFlowBounds([
        { x: 100, y: 120, width: 300, height: 200 },
        getStickyNoteBounds({
          id: "note-1",
          title: "",
          text: "",
          x: -200,
          y: 700,
          width: 240,
          height: 180,
        }),
      ])
    ).toEqual({
      x: -200,
      y: 120,
      width: 600,
      height: 760,
    })
  })

  it("uses sticky note display dimensions for viewport bounds", () => {
    expect(
      getStickyNoteBounds({
        id: "note-1",
        title: "",
        text: "",
        x: 20,
        y: 40,
        width: 1000,
        height: 20,
      })
    ).toEqual({
      x: 20,
      y: 40,
      width: MAX_STICKY_NOTE_WIDTH,
      height: MIN_STICKY_NOTE_HEIGHT,
    })

    expect(
      getStickyNoteBounds({
        id: "note-2",
        title: "",
        text: "",
        x: 20,
        y: 40,
        height: 1000,
      })
    ).toEqual({
      x: 20,
      y: 40,
      width: MIN_STICKY_NOTE_WIDTH,
      height: MAX_STICKY_NOTE_HEIGHT,
    })
  })
})
