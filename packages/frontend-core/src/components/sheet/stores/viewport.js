import { writable, derived } from "svelte/store"

export const createViewportStores = context => {
  const { cellHeight, columns, rows, scroll, bounds } = context

  // Use local variables to avoid needing to invoke 2 svelte getters each time
  // scroll state changes, but also use stores to allow use of derived stores
  let scrollTop = 0
  let scrollLeft = 0
  const scrollTopStore = writable(0)
  const scrollLeftStore = writable(0)

  // Derive height and width as primitives to avoid wasted computation
  const width = derived(bounds, $bounds => $bounds.width)
  const height = derived(bounds, $bounds => $bounds.height)

  // Debounce scroll updates so we can slow down visible row computation
  scroll.subscribe(({ left, top }) => {
    // Only update local state when big changes occur
    if (Math.abs(top - scrollTop) > cellHeight * 2) {
      scrollTop = top
      scrollTopStore.set(top)
    }
    if (Math.abs(left - scrollLeft) > 100) {
      scrollLeft = left
      scrollLeftStore.set(left)
    }
  })

  // Derive visible rows
  const visibleRows = derived(
    [rows, scrollTopStore, height],
    ([$rows, $scrollTop, $height]) => {
      console.log("new rows")
      const maxRows = Math.ceil($height / cellHeight) + 8
      const firstRow = Math.max(0, Math.floor($scrollTop / cellHeight) - 4)
      return $rows.slice(firstRow, firstRow + maxRows)
    }
  )

  // Derive visible columns
  const visibleColumns = derived(
    [columns, scrollLeftStore, width],
    ([$columns, $scrollLeft, $width]) => {
      console.log("new columns")
      if (!$columns.length) {
        return []
      }
      let startColIdx = 1
      let rightEdge = $columns[1].width
      while (rightEdge < $scrollLeft) {
        startColIdx++
        rightEdge += $columns[startColIdx].width
      }
      let endColIdx = startColIdx + 1
      let leftEdge = $columns[0].width + 40 + rightEdge
      while (leftEdge < $width + $scrollLeft) {
        leftEdge += $columns[endColIdx]?.width
        endColIdx++
      }
      return [
        $columns[0],
        ...$columns.slice(Math.max(1, startColIdx - 2), endColIdx + 2),
      ]
    }
  )

  return { visibleRows, visibleColumns }
}
