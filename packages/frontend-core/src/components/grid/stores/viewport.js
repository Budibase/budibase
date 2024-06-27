import { derived } from "svelte/store"
import { MinColumnWidth } from "../lib/constants"

export const deriveStores = context => {
  const {
    rowHeight,
    visibleColumns,
    rows,
    scrollTop,
    scrollLeft,
    width,
    height,
    rowChangeCache,
    conditionMetadata,
  } = context

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
    [
      rows,
      scrolledRowCount,
      visualRowCapacity,
      rowChangeCache,
      conditionMetadata,
    ],
    ([
      $rows,
      $scrolledRowCount,
      $visualRowCapacity,
      $rowChangeCache,
      $conditionMetadata,
    ]) => {
      return $rows
        .slice($scrolledRowCount, $scrolledRowCount + $visualRowCapacity)
        .map(row => ({
          ...row,
          ...$rowChangeCache[row._id],
          __metadata: $conditionMetadata[row._id],
        }))
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
    scrolledRowCount,
    visualRowCapacity,
    renderedRows,
    columnRenderMap,
  }
}
