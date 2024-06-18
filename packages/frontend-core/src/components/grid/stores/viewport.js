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
    pages,
    rowChangeCache,
    loading,
  } = context

  const pageHeight = derived(rowHeight, $rowHeight => $rowHeight * RowPageSize)
  const firstVisiblePage = derived(
    [scrollTop, pageHeight],
    ([$scrollTop, $pageHeight]) => {
      return Math.floor($scrollTop / $pageHeight)
    },
    0
  )
  const lastVisiblePage = derived(
    [firstVisiblePage, pageHeight, scrollTop, height],
    ([$firstVisiblePage, $pageHeight, $scrollTop, $height]) => {
      const pageBottom = ($firstVisiblePage + 1) * $pageHeight
      return pageBottom > $scrollTop + $height
        ? $firstVisiblePage
        : $firstVisiblePage + 1
    }
  )
  const visiblePages = derived(
    [firstVisiblePage, lastVisiblePage],
    ([$firstVisiblePage, $lastVisiblePage]) => {
      if ($lastVisiblePage === $firstVisiblePage) {
        return [$firstVisiblePage]
      } else {
        return [$firstVisiblePage, $lastVisiblePage]
      }
    }
  )

  // Derive visible rows
  // Split into multiple stores containing primitives to optimise invalidation
  // as much as possible
  const scrolledRowCount = derived(
    [scrollTop, rowHeight],
    ([$scrollTop, $rowHeight]) => {
      return Math.floor($scrollTop / $rowHeight)
    },
    0
  )
  const visualRowCapacity = derived(
    [height, rowHeight],
    ([$height, $rowHeight]) => {
      return Math.ceil($height / $rowHeight) + 1
    },
    0
  )
  const renderedRows = derived(
    [pages, visiblePages, scrolledRowCount, visualRowCapacity, rowChangeCache],
    ([
      $pages,
      $visiblePages,
      $scrolledRowCount,
      $visualRowCapacity,
      $rowChangeCache,
    ]) => {
      const prevPagesRowCount = $visiblePages[0] * RowPageSize
      const scrolledInPage = $scrolledRowCount - prevPagesRowCount
      let rows = $pages[$visiblePages[0]] || []
      if ($visiblePages[1]) {
        rows = rows.concat($pages[$visiblePages[1]] || [])
      }
      let rendered = rows
        .slice(scrolledInPage, scrolledInPage + $visualRowCapacity)
        .map(row => ({
          ...row,
          ...$rowChangeCache[row._id],
        }))
      if (rendered.length < $visualRowCapacity) {
        rendered = new Array($visualRowCapacity)
        for (let i = 0; i < $visualRowCapacity; i++) {
          rendered[i] = {
            _id: i,
            __placeholder: true,
            __idx: $scrolledRowCount + i,
          }
        }
      }
      return rendered
    },
    []
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
