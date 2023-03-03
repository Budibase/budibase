import { derived, get, writable } from "svelte/store"

export const createScrollStores = context => {
  const { rows, columns, stickyColumn, bounds, cellHeight } = context
  const padding = 180
  const scroll = writable({
    left: 0,
    top: 0,
  })

  // Memoize store primitives
  const scrollTop = derived(scroll, $scroll => $scroll.top)
  const scrollLeft = derived(scroll, $scroll => $scroll.left)

  // Derive vertical limits
  const height = derived(bounds, $bounds => $bounds.height, 0)
  const width = derived(bounds, $bounds => $bounds.width, 0)
  const contentHeight = derived(
    rows,
    $rows => ($rows.length + 1) * cellHeight + padding,
    0
  )
  const maxScrollTop = derived(
    [height, contentHeight],
    ([$height, $contentHeight]) => Math.max($contentHeight - $height, 0),
    0
  )

  // Derive horizontal limits
  const contentWidth = derived(
    [columns, stickyColumn],
    ([$columns, $stickyColumn]) => {
      let width = 40 + padding + ($stickyColumn?.width || 0)
      $columns.forEach(col => {
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
    scroll,
    contentHeight,
    contentWidth,
    maxScrollTop,
    maxScrollLeft,
  }
}
