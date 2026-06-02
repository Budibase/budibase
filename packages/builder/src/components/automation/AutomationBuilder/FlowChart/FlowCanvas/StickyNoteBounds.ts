import type { StickyNote } from "@/types/automations"

export interface FlowBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface StickyNoteSize {
  width: number
  height: number
}

export interface StickyNotePosition {
  x: number
  y: number
}

export interface StickyNoteViewport {
  x: number
  y: number
  zoom: number
}

export const MIN_STICKY_NOTE_WIDTH = 160
export const MIN_STICKY_NOTE_HEIGHT = 140
export const MAX_STICKY_NOTE_WIDTH = 300
export const MAX_STICKY_NOTE_HEIGHT = 400

export const getBoundsOfFlowBounds = (bounds: FlowBounds[]): FlowBounds => {
  const left = Math.min(...bounds.map(bound => bound.x))
  const top = Math.min(...bounds.map(bound => bound.y))
  const right = Math.max(...bounds.map(bound => bound.x + bound.width))
  const bottom = Math.max(...bounds.map(bound => bound.y + bound.height))

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  }
}

export const getStickyNoteBounds = (note: StickyNote): FlowBounds => ({
  x: note.x,
  y: note.y,
  width: Math.min(
    MAX_STICKY_NOTE_WIDTH,
    Math.max(MIN_STICKY_NOTE_WIDTH, note.width ?? MIN_STICKY_NOTE_WIDTH)
  ),
  height: Math.min(
    MAX_STICKY_NOTE_HEIGHT,
    Math.max(MIN_STICKY_NOTE_HEIGHT, note.height ?? MIN_STICKY_NOTE_HEIGHT)
  ),
})

export const clampStickyNoteToGraphBounds = (
  position: StickyNotePosition,
  nodeBounds: FlowBounds,
  noteSize: StickyNoteSize
) => {
  const minX = nodeBounds.x - noteSize.width - MAX_STICKY_NOTE_WIDTH
  const maxX = nodeBounds.x + nodeBounds.width
  const minY = nodeBounds.y - noteSize.height - MAX_STICKY_NOTE_HEIGHT
  const maxY = nodeBounds.y + nodeBounds.height + MAX_STICKY_NOTE_HEIGHT

  return {
    x:
      minX > maxX
        ? nodeBounds.x + nodeBounds.width / 2 - noteSize.width / 2
        : Math.min(maxX, Math.max(minX, position.x)),
    y:
      minY > maxY
        ? nodeBounds.y + nodeBounds.height / 2 - noteSize.height / 2
        : Math.min(maxY, Math.max(minY, position.y)),
  }
}

export const clampStickyNoteToViewportBounds = (
  position: StickyNotePosition,
  viewport: StickyNoteViewport,
  viewportBounds: Pick<FlowBounds, "width" | "height">,
  noteSize: StickyNoteSize
) => {
  const zoom = viewport.zoom || 1
  const minVisibleX = -viewport.x / zoom
  const maxVisibleX =
    (viewportBounds.width - viewport.x) / zoom - noteSize.width
  const minVisibleY = -viewport.y / zoom
  const maxVisibleY =
    (viewportBounds.height - viewport.y) / zoom - noteSize.height

  return {
    x:
      minVisibleX > maxVisibleX
        ? minVisibleX
        : Math.min(maxVisibleX, Math.max(minVisibleX, position.x)),
    y:
      minVisibleY > maxVisibleY
        ? minVisibleY
        : Math.min(maxVisibleY, Math.max(minVisibleY, position.y)),
  }
}
