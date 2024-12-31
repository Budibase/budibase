import { writable, derived, get, Writable, Readable } from "svelte/store"
import { tick } from "svelte"
import {
  GutterWidth,
  FocusedCellMinOffset,
  ScrollBarSize,
  HPadding,
  VPadding,
} from "../lib/constants"
import { parseCellID } from "../lib/utils"
import { Store as StoreContext } from "."

interface ScrollStore {
  scroll: Writable<{
    left: number
    top: number
  }>
  scrollTop: Readable<number>
  scrollLeft: Readable<number>
}

interface ScrollDerivedStore {
  stickyWidth: Readable<number>
  contentHeight: Readable<number>
  contentWidth: Readable<number>
  screenWidth: Readable<number>
  maxScrollTop: Readable<number>
  maxScrollLeft: Readable<number>
  showHScrollbar: Readable<number>
  showVScrollbar: Readable<number>
}

export type Store = ScrollStore & ScrollDerivedStore

export const createStores = (): ScrollStore => {
  const scroll = writable({
    left: 0,
    top: 0,
  })

  // Derive height and width as primitives to avoid wasted computation
  const scrollTop = derived(scroll, $scroll => Math.round($scroll.top))
  const scrollLeft = derived(scroll, $scroll => Math.round($scroll.left))

  return {
    scroll,
    scrollTop,
    scrollLeft,
  }
}

export const deriveStores = (context: StoreContext) => {
  const {
    rows,
    visibleColumns,
    displayColumn,
    rowHeight,
    width,
    height,
    buttonColumnWidth,
  } = context

  // Memoize store primitives
  const stickyWidth = derived(displayColumn, $displayColumn => {
    return ($displayColumn?.width || 0) + GutterWidth
  })

  // Derive horizontal limits
  const contentWidth = derived(
    [visibleColumns, buttonColumnWidth],
    ([$visibleColumns, $buttonColumnWidth]) => {
      let width = GutterWidth + Math.max($buttonColumnWidth, HPadding)
      $visibleColumns.forEach(col => {
        width += col.width
      })
      return width
    }
  )
  const screenWidth = derived(
    [width, stickyWidth],
    ([$width, $stickyWidth]) => {
      return $width + $stickyWidth
    }
  )
  const maxScrollLeft = derived(
    [contentWidth, screenWidth],
    ([$contentWidth, $screenWidth]) => {
      return Math.round(Math.max($contentWidth - $screenWidth, 0))
    }
  )
  const showHScrollbar = derived(
    [contentWidth, screenWidth],
    ([$contentWidth, $screenWidth]) => {
      return $contentWidth > $screenWidth
    }
  )

  // Derive vertical limits
  const contentHeight = derived(
    [rows, rowHeight, showHScrollbar],
    ([$rows, $rowHeight, $showHScrollbar]) => {
      let height = ($rows.length + 1) * $rowHeight + VPadding
      if ($showHScrollbar) {
        height += ScrollBarSize * 2
      }
      return height
    }
  )
  const maxScrollTop = derived(
    [height, contentHeight],
    ([$height, $contentHeight]) =>
      Math.round(Math.max($contentHeight - $height, 0))
  )
  const showVScrollbar = derived(
    [contentHeight, height],
    ([$contentHeight, $height]) => {
      return $contentHeight > $height
    }
  )

  return {
    stickyWidth,
    contentHeight,
    contentWidth,
    screenWidth,
    maxScrollTop,
    maxScrollLeft,
    showHScrollbar,
    showVScrollbar,
  }
}

export const initialise = (context: StoreContext) => {
  const {
    focusedCellId,
    focusedRow,
    scroll,
    bounds,
    rowHeight,
    stickyWidth,
    scrollTop,
    maxScrollTop,
    scrollLeft,
    maxScrollLeft,
    buttonColumnWidth,
    columnLookupMap,
  } = context

  // Ensure scroll state never goes invalid, which can happen when changing
  // rows or tables
  const overscrollTop = derived(
    [scrollTop, maxScrollTop],
    ([$scrollTop, $maxScrollTop]) => $scrollTop > $maxScrollTop,
    false
  )
  const overscrollLeft = derived(
    [scrollLeft, maxScrollLeft],
    ([$scrollLeft, $maxScrollLeft]) => $scrollLeft > $maxScrollLeft,
    false
  )
  overscrollTop.subscribe(overscroll => {
    if (overscroll) {
      scroll.update(state => ({
        ...state,
        top: get(maxScrollTop),
      }))
    }
  })
  overscrollLeft.subscribe(overscroll => {
    if (overscroll) {
      scroll.update(state => ({
        ...state,
        left: get(maxScrollLeft),
      }))
    }
  })

  // Ensure the selected cell is visible
  focusedCellId.subscribe(async $focusedCellId => {
    await tick()
    const $focusedRow = get(focusedRow)
    const $scroll = get(scroll)
    const $bounds = get(bounds)
    const $rowHeight = get(rowHeight)

    // Ensure vertical position is viewable
    if ($focusedRow) {
      // Ensure row is not below bottom of screen
      const rowYPos = $focusedRow.__idx * $rowHeight
      const bottomCutoff =
        $scroll.top + $bounds.height - $rowHeight - FocusedCellMinOffset
      let delta = rowYPos - bottomCutoff
      if (delta > 0) {
        scroll.update(state => ({
          ...state,
          top: state.top + delta,
        }))
      }

      // Ensure row is not above top of screen
      else {
        const delta = $scroll.top - rowYPos + FocusedCellMinOffset
        if (delta > 0) {
          scroll.update(state => ({
            ...state,
            top: Math.max(0, state.top - delta),
          }))
        }
      }
    }

    // Ensure horizontal position is viewable
    // Check horizontal position of columns next
    const { field } = parseCellID($focusedCellId)
    const column = get(columnLookupMap)[field!]
    if (!column || column.primaryDisplay) {
      return
    }

    // Ensure column is not cutoff on left edge
    const $stickyWidth = get(stickyWidth)
    let delta =
      $scroll.left - column.__left + FocusedCellMinOffset + $stickyWidth
    if (delta > 0) {
      scroll.update(state => ({
        ...state,
        left: Math.max(0, state.left - delta),
      }))
    }

    // Ensure column is not cutoff on right edge
    else {
      const $buttonColumnWidth = get(buttonColumnWidth)
      const rightEdge = column.__left + column.width
      const rightBound =
        $bounds.width + $scroll.left - FocusedCellMinOffset - $buttonColumnWidth
      delta = rightEdge - rightBound - $stickyWidth
      if (delta > 0) {
        scroll.update(state => ({
          ...state,
          left: state.left + delta,
        }))
      }
    }
  })
}
