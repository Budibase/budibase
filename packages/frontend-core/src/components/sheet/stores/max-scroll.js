import { derived, get } from "svelte/store"

export const createMaxScrollStores = context => {
  const { rows, visibleColumns, stickyColumn, bounds, cellHeight, scroll } =
    context
  const padding = 180

  // Memoize store primitives
  const scrollTop = derived(scroll, $scroll => $scroll.top, 0)
  const scrollLeft = derived(scroll, $scroll => $scroll.left, 0)

  // Derive vertical limits
  const height = derived(bounds, $bounds => $bounds.height, 0)
  const width = derived(bounds, $bounds => $bounds.width, 0)
  const contentHeight = derived(
    rows,
    $rows => $rows.length * cellHeight + padding,
    0
  )
  const maxScrollTop = derived(
    [height, contentHeight],
    ([$height, $contentHeight]) => Math.max($contentHeight - $height, 0),
    0
  )

  // Derive horizontal limits
  const contentWidth = derived(
    [visibleColumns, stickyColumn],
    ([$visibleColumns, $stickyColumn]) => {
      let width = 40 + padding + ($stickyColumn?.width || 0)
      $visibleColumns.forEach(col => {
        width += col.width
      })
      return width
    },
    0
  )
  const screenWidth = derived(
    [width, stickyColumn],
    ([$width, $stickyColumn]) => $width + 40 + ($stickyColumn?.width || 0),
    0
  )
  const maxScrollLeft = derived(
    [contentWidth, screenWidth],
    ([$contentWidth, $screenWidth]) => {
      return Math.max($contentWidth - $screenWidth, 0)
    },
    0
  )

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

  return {
    contentHeight,
    contentWidth,
    maxScrollTop,
    maxScrollLeft,
  }
}
