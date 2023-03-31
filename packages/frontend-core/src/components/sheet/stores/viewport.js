import { derived, get } from "svelte/store"

export const createViewportStores = context => {
  const { cellHeight, visibleColumns, rows, scroll, bounds } = context
  const scrollTop = derived(scroll, $scroll => $scroll.top, 0)
  const scrollLeft = derived(scroll, $scroll => $scroll.left, 0)

  // Derive height and width as primitives to avoid wasted computation
  const width = derived(bounds, $bounds => $bounds.width, 0)
  const height = derived(bounds, $bounds => $bounds.height, 0)

  // Derive visible rows
  // Split into multiple stores containing primitives to optimise invalidation
  // as much as possible
  const scrolledRowCount = derived(
    scrollTop,
    $scrollTop => {
      return Math.floor($scrollTop / cellHeight)
    },
    0
  )
  const visualRowCapacity = derived(
    height,
    $height => {
      return Math.ceil($height / cellHeight) + 1
    },
    0
  )
  const renderedRows = derived(
    [rows, scrolledRowCount, visualRowCapacity],
    ([$rows, $scrolledRowCount, $visualRowCapacity]) => {
      return $rows.slice(
        $scrolledRowCount,
        $scrolledRowCount + $visualRowCapacity
      )
    },
    []
  )

  // Derive visible columns
  const renderedColumns = derived(
    [visibleColumns, scrollLeft, width],
    ([$visibleColumns, $scrollLeft, $width]) => {
      if (!$visibleColumns.length) {
        return []
      }
      let startColIdx = 0
      let rightEdge = $visibleColumns[0].width
      while (
        rightEdge < $scrollLeft &&
        startColIdx < $visibleColumns.length - 1
      ) {
        startColIdx++
        rightEdge += $visibleColumns[startColIdx].width
      }
      let endColIdx = startColIdx + 1
      let leftEdge = rightEdge
      while (
        leftEdge < $width + $scrollLeft &&
        endColIdx < $visibleColumns.length
      ) {
        leftEdge += $visibleColumns[endColIdx].width
        endColIdx++
      }
      const nextRenderedColumns = $visibleColumns.slice(startColIdx, endColIdx)

      // Cautiously shrink the number of rendered columns.
      // This is to avoid rapidly shrinking and growing the visible column count
      // which results in remounting cells
      const currentCount = get(renderedColumns).length
      if (currentCount === nextRenderedColumns.length + 1) {
        return $visibleColumns.slice(startColIdx, endColIdx + 1)
      } else {
        return nextRenderedColumns
      }
    },
    []
  )

  return { scrolledRowCount, visualRowCapacity, renderedRows, renderedColumns }
}
