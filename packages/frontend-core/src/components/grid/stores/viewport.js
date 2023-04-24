import { derived, get } from "svelte/store"
import {
  MaxCellRenderHeight,
  MaxCellRenderWidthOverflow,
  ScrollBarSize,
} from "../lib/constants"

export const deriveStores = context => {
  const {
    rowHeight,
    visibleColumns,
    enrichedRows,
    scrollTop,
    scrollLeft,
    width,
    height,
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
    [enrichedRows, scrolledRowCount, visualRowCapacity],
    ([$enrichedRows, $scrolledRowCount, $visualRowCapacity]) => {
      return $enrichedRows.slice(
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

  const hiddenColumnsWidth = derived(
    [renderedColumns, visibleColumns],
    ([$renderedColumns, $visibleColumns]) => {
      const idx = $visibleColumns.findIndex(
        col => col.name === $renderedColumns[0]?.name
      )
      let width = 0
      if (idx > 0) {
        for (let i = 0; i < idx; i++) {
          width += $visibleColumns[i].width
        }
      }
      return width
    },
    0
  )

  // Determine the row index at which we should start vertically inverting cell
  // dropdowns
  const rowVerticalInversionIndex = derived(
    [visualRowCapacity, rowHeight],
    ([$visualRowCapacity, $rowHeight]) => {
      return (
        $visualRowCapacity - Math.ceil(MaxCellRenderHeight / $rowHeight) - 2
      )
    }
  )

  // Determine the column index at which we should start horizontally inverting
  // cell dropdowns
  const columnHorizontalInversionIndex = derived(
    [renderedColumns, scrollLeft, width],
    ([$renderedColumns, $scrollLeft, $width]) => {
      const cutoff = $width + $scrollLeft - ScrollBarSize * 3
      let inversionIdx = $renderedColumns.length
      for (let i = $renderedColumns.length - 1; i >= 0; i--, inversionIdx--) {
        const rightEdge = $renderedColumns[i].left + $renderedColumns[i].width
        if (rightEdge + MaxCellRenderWidthOverflow < cutoff) {
          break
        }
      }
      return inversionIdx
    }
  )

  return {
    scrolledRowCount,
    visualRowCapacity,
    renderedRows,
    renderedColumns,
    hiddenColumnsWidth,
    rowVerticalInversionIndex,
    columnHorizontalInversionIndex,
  }
}
