import { derived, Readable } from "svelte/store"
import { MinColumnWidth } from "../lib/constants"
import { Store as StoreContext } from "."
import { Row } from "@budibase/types"

interface ViewportDerivedStore {
  scrolledRowCount: Readable<number>
  visualRowCapacity: Readable<number>
  renderedRows: Readable<Row>
  columnRenderMap: Readable<Record<string, true>>
}

export type Store = ViewportDerivedStore

export const deriveStores = (context: StoreContext): ViewportDerivedStore => {
  const {
    rowHeight,
    scrollableColumns,
    rows,
    scrollTop,
    scrollLeft,
    width,
    height,
    rowChangeCache,
    metadata,
  } = context

  // Derive visible rows
  // Split into multiple stores containing primitives to optimise invalidation
  // as much as possible
  const scrolledRowCount = derived(
    [scrollTop, rowHeight],
    ([$scrollTop, $rowHeight]) => {
      return Math.floor($scrollTop / $rowHeight)
    }
  )
  const visualRowCapacity = derived(
    [height, rowHeight],
    ([$height, $rowHeight]) => {
      return Math.ceil($height / $rowHeight) + 1
    }
  )
  const renderedRows = derived(
    [rows, scrolledRowCount, visualRowCapacity, rowChangeCache, metadata],
    ([
      $rows,
      $scrolledRowCount,
      $visualRowCapacity,
      $rowChangeCache,
      $metadata,
    ]) => {
      return $rows
        .slice($scrolledRowCount, $scrolledRowCount + $visualRowCapacity)
        .map(row => ({
          ...row,
          ...$rowChangeCache[row._id],
          __metadata: $metadata[row._id],
        }))
    }
  )

  // Derive visible columns
  const scrollLeftRounded = derived(scrollLeft, $scrollLeft => {
    const interval = MinColumnWidth
    return Math.round($scrollLeft / interval) * interval
  })
  const columnRenderMap = derived(
    [scrollableColumns, scrollLeftRounded, width],
    ([$scrollableColumns, $scrollLeft, $width]) => {
      if (!$scrollableColumns.length) {
        return {}
      }
      let startColIdx = 0
      let rightEdge = $scrollableColumns[0].width
      while (
        rightEdge < $scrollLeft &&
        startColIdx < $scrollableColumns.length - 1
      ) {
        startColIdx++
        rightEdge += $scrollableColumns[startColIdx].width
      }
      let endColIdx = startColIdx + 1
      let leftEdge = rightEdge
      while (
        leftEdge < $width + $scrollLeft &&
        endColIdx < $scrollableColumns.length
      ) {
        leftEdge += $scrollableColumns[endColIdx].width
        endColIdx++
      }
      let next: Record<string, true> = {}
      $scrollableColumns
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
