import { derived, get } from "svelte/store"

export const createViewportStores = context => {
  const { cellHeight, columns, rows, scroll, bounds } = context
  const scrollTop = derived(scroll, $scroll => $scroll.top, 0)
  const scrollLeft = derived(scroll, $scroll => $scroll.left, 0)

  // Derive height and width as primitives to avoid wasted computation
  const width = derived(bounds, $bounds => $bounds.width)
  const height = derived(bounds, $bounds => $bounds.height)

  // Derive visible rows
  // Split into multiple stores containing primitives to optimise invalidation
  // as mich as possible
  const firstRowIdx = derived(scrollTop, $scrollTop => {
    return Math.floor($scrollTop / cellHeight)
  })
  const visibleRowCount = derived(height, $height => {
    return Math.ceil($height / cellHeight)
  })
  const visibleRows = derived(
    [rows, firstRowIdx, visibleRowCount],
    ([$rows, $firstRowIdx, $visibleRowCount]) => {
      return $rows.slice($firstRowIdx, $firstRowIdx + $visibleRowCount)
    }
  )

  // Derive visible columns
  const visibleColumns = derived(
    [columns, scrollLeft, width],
    ([$columns, $scrollLeft, $width]) => {
      if (!$columns.length) {
        return []
      }
      let startColIdx = 0
      let rightEdge = $columns[0].width
      while (rightEdge < $scrollLeft && startColIdx < $columns.length - 1) {
        startColIdx++
        rightEdge += $columns[startColIdx].width
      }
      let endColIdx = startColIdx + 1
      let leftEdge = rightEdge
      while (leftEdge < $width + $scrollLeft && endColIdx < $columns.length) {
        leftEdge += $columns[endColIdx].width
        endColIdx++
      }
      return $columns.slice(startColIdx, endColIdx)
    }
  )

  // Fetch next page when approaching end of data
  visibleRows.subscribe($visibleRows => {
    const lastVisible = $visibleRows[$visibleRows.length - 1]
    const $rows = get(rows)
    const lastRow = $rows[$rows.length - 1]
    if (lastVisible && lastRow && lastVisible._id === lastRow._id) {
      rows.actions.loadNextPage()
    }
  })

  return { visibleRows, visibleColumns }
}
