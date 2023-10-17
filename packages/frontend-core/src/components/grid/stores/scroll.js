import { writable, derived, get } from "svelte/store"
import { tick } from "svelte"
import { Padding, GutterWidth, FocusedCellMinOffset } from "../lib/constants"

export const createStores = () => {
  const scroll = writable({
    left: 0,
    top: 0,
  })

  // Derive height and width as primitives to avoid wasted computation
  const scrollTop = derived(scroll, $scroll => $scroll.top, 0)
  const scrollLeft = derived(scroll, $scroll => $scroll.left, 0)

  return {
    scroll,
    scrollTop,
    scrollLeft,
  }
}

export const deriveStores = context => {
  const { rows, visibleColumns, stickyColumn, rowHeight, width, height } =
    context

  // Memoize store primitives
  const stickyColumnWidth = derived(stickyColumn, $col => $col?.width || 0, 0)

  // Derive vertical limits
  const contentHeight = derived(
    [rows, rowHeight],
    ([$rows, $rowHeight]) => ($rows.length + 1) * $rowHeight + Padding,
    0
  )
  const maxScrollTop = derived(
    [height, contentHeight],
    ([$height, $contentHeight]) => Math.max($contentHeight - $height, 0),
    0
  )

  // Derive horizontal limits
  const contentWidth = derived(
    [visibleColumns, stickyColumnWidth],
    ([$visibleColumns, $stickyColumnWidth]) => {
      let width = GutterWidth + Padding + $stickyColumnWidth
      $visibleColumns.forEach(col => {
        width += col.width
      })
      return width
    },
    0
  )
  const screenWidth = derived(
    [width, stickyColumnWidth],
    ([$width, $stickyColumnWidth]) => $width + GutterWidth + $stickyColumnWidth,
    0
  )
  const maxScrollLeft = derived(
    [contentWidth, screenWidth],
    ([$contentWidth, $screenWidth]) => {
      return Math.max($contentWidth - $screenWidth, 0)
    },
    0
  )

  // Derive whether to show scrollbars or not
  const showVScrollbar = derived(
    [contentHeight, height],
    ([$contentHeight, $height]) => {
      return $contentHeight > $height
    }
  )
  const showHScrollbar = derived(
    [contentWidth, screenWidth],
    ([$contentWidth, $screenWidth]) => {
      return $contentWidth > $screenWidth
    }
  )

  return {
    contentHeight,
    contentWidth,
    screenWidth,
    maxScrollTop,
    maxScrollLeft,
    showHScrollbar,
    showVScrollbar,
  }
}

export const initialise = context => {
  const {
    focusedCellId,
    focusedRow,
    scroll,
    bounds,
    rowHeight,
    visibleColumns,
    scrollTop,
    maxScrollTop,
    scrollLeft,
    maxScrollLeft,
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
    const $visibleColumns = get(visibleColumns)
    const columnName = $focusedCellId?.split("-")[1]
    const column = $visibleColumns.find(col => col.name === columnName)
    if (!column) {
      return
    }

    // Ensure column is not cutoff on left edge
    let delta = $scroll.left - column.left + FocusedCellMinOffset
    if (delta > 0) {
      scroll.update(state => ({
        ...state,
        left: Math.max(0, state.left - delta),
      }))
    }

    // Ensure column is not cutoff on right edge
    else {
      const rightEdge = column.left + column.width
      const rightBound = $bounds.width + $scroll.left - FocusedCellMinOffset
      delta = rightEdge - rightBound
      if (delta > 0) {
        scroll.update(state => ({
          ...state,
          left: state.left + delta,
        }))
      }
    }
  })
}
