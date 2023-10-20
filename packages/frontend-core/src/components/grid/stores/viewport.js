import { derived, get } from "svelte/store"
import {
  MaxCellRenderHeight,
  MaxCellRenderWidthOverflow,
  MinColumnWidth,
  ScrollBarSize,
} from "../lib/constants"

export const deriveStores = context => {
  const {
    rowHeight,
    visibleColumns,
    rows,
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
  const scrollLeftRounded = derived(scrollLeft, $scrollLeft => {
    const interval = MinColumnWidth
    return Math.round($scrollLeft / interval) * interval
  })
  const renderedColumns = derived(
    [visibleColumns, scrollLeftRounded, width],
    ([$visibleColumns, $scrollLeft, $width], set) => {
      if (!$visibleColumns.length) {
        set([])
        return
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
      // Render an additional column on either side to account for
      // debounce column updates based on scroll position
      const next = $visibleColumns.slice(
        Math.max(0, startColIdx - 1),
        endColIdx + 1
      )
      const current = get(renderedColumns)
      if (JSON.stringify(next) !== JSON.stringify(current)) {
        set(next)
      }
    }
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
    [height, rowHeight, scrollTop],
    ([$height, $rowHeight, $scrollTop]) => {
      const offset = $scrollTop % $rowHeight

      // Compute the last row index with space to render popovers below it
      const minBottom =
        $height - ScrollBarSize * 3 - MaxCellRenderHeight + offset
      const lastIdx = Math.floor(minBottom / $rowHeight)

      // Compute the first row index with space to render popovers above it
      const minTop = MaxCellRenderHeight + offset
      const firstIdx = Math.ceil(minTop / $rowHeight)

      // Use the greater of the two indices so that we prefer content below,
      // unless there is room to render the entire popover above
      return Math.max(lastIdx, firstIdx)
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
        if (rightEdge + MaxCellRenderWidthOverflow <= cutoff) {
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
