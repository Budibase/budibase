import { derived } from "svelte/store"
import { RowPageSize, MinColumnWidth } from "../lib/constants"

export const deriveStores = context => {
  const {
    rowHeight,
    visibleColumns,
    scrollTop,
    scrollLeft,
    width,
    height,
    rowChangeCache,
    rowIndexLookupMap,
    totalRows,
  } = context

  // The amount of rows scrolled by the current scroll offset
  const scrolledRowCount = derived(
    [scrollTop, rowHeight],
    ([$scrollTop, $rowHeight]) => {
      return Math.floor($scrollTop / $rowHeight)
    },
    0
  )

  // The amount of rows we can visually fit into the viewport
  const visualRowCapacity = derived(
    [height, rowHeight],
    ([$height, $rowHeight]) => {
      return Math.ceil($height / $rowHeight) + 1
    },
    0
  )

  // The first page of data we require to display the desired rows
  const firstVisiblePage = derived(scrolledRowCount, $scrolledRowCount => {
    const firstDesiredRow = Math.max(0, $scrolledRowCount - RowPageSize / 3)
    return Math.floor(firstDesiredRow / RowPageSize)
  })

  // The last page of data we require to display the desired rows
  const lastVisiblePage = derived(
    [scrolledRowCount, visualRowCapacity],
    ([$scrolledRowCount, $visualRowCapacity]) => {
      const lastDesiredRow =
        $scrolledRowCount + $visualRowCapacity + RowPageSize / 3
      return Math.floor(lastDesiredRow / RowPageSize)
    }
  )

  // The array of all pages required to display the desired rows
  const visiblePages = derived(
    [firstVisiblePage, lastVisiblePage],
    ([$firstVisiblePage, $lastVisiblePage]) => {
      if ($lastVisiblePage === $firstVisiblePage) {
        return [$firstVisiblePage]
      } else {
        let pages = []
        for (let i = $firstVisiblePage; i <= $lastVisiblePage; i++) {
          pages.push(i)
        }
        return pages
      }
    }
  )

  // The array of rows that will be rendered
  const renderedRows = derived(
    [
      rowIndexLookupMap,
      rowChangeCache,
      scrolledRowCount,
      visualRowCapacity,
      totalRows,
    ],
    ([
      $rowIndexLookupMap,
      $rowChangeCache,
      $scrolledRowCount,
      $visualRowCapacity,
      $totalRows,
    ]) => {
      let rows = []
      const maxIdx = Math.min(
        $totalRows - 1,
        $scrolledRowCount + $visualRowCapacity
      )
      for (let i = $scrolledRowCount; i <= maxIdx; i++) {
        if ($rowIndexLookupMap[i]) {
          rows.push({
            ...$rowIndexLookupMap[i],
            ...$rowChangeCache[$rowIndexLookupMap[i]._id],
          })
        } else {
          rows.push({
            _id: i,
            __idx: i,
            __placeholder: true,
          })
        }
      }
      return rows
    }
  )

  // Derive visible columns
  const scrollLeftRounded = derived(scrollLeft, $scrollLeft => {
    const interval = MinColumnWidth
    return Math.round($scrollLeft / interval) * interval
  })
  const columnRenderMap = derived(
    [visibleColumns, scrollLeftRounded, width],
    ([$visibleColumns, $scrollLeft, $width]) => {
      if (!$visibleColumns.length) {
        return {}
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

      // Only update the store if different
      let next = {}
      $visibleColumns
        .slice(Math.max(0, startColIdx), endColIdx)
        .forEach(col => {
          next[col.name] = true
        })
      return next
    }
  )

  return {
    visiblePages,
    scrolledRowCount,
    visualRowCapacity,
    renderedRows,
    columnRenderMap,
  }
}
