import { writable, derived, get } from "svelte/store"

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
    scrollTop = top
    scrollTopStore.set(top)
    scrollLeft = left
    scrollLeftStore.set(left)
  })

  // Derive visible rows
  const visibleRows = derived(
    [rows, scrollTopStore, height],
    ([$rows, $scrollTop, $height]) => {
      const maxRows = Math.ceil($height / cellHeight) + 1
      const firstRow = Math.max(0, Math.floor($scrollTop / cellHeight))
      return $rows.slice(firstRow, firstRow + maxRows)
    }
  )

  // Derive visible columns
  const visibleColumns = derived(
    [columns, scrollLeftStore, width],
    ([$columns, $scrollLeft, $width]) => {
      if (!$columns.length) {
        return []
      }
      let startColIdx = 0
      let rightEdge = $columns[0].width
      while (rightEdge < $scrollLeft) {
        startColIdx++
        rightEdge += $columns[startColIdx].width
      }
      let endColIdx = startColIdx + 1
      let leftEdge = rightEdge
      while (leftEdge < $width + $scrollLeft) {
        leftEdge += $columns[endColIdx]?.width
        endColIdx++
      }
      return $columns.slice(Math.max(0, startColIdx - 1), endColIdx + 1)
    }
  )

  // visibleColumns.subscribe(state => {
  //   console.log(state)
  // })

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
