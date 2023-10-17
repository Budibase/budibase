import { derived } from "svelte/store"
import {
  MaxCellRenderHeight,
  MaxCellRenderWidthOverflow,
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
    [visibleColumns, scrollLeft, width],
    ([$visibleColumns, $scrollLeft, $width]) => {
      const cutoff = $width + $scrollLeft - ScrollBarSize * 3
      let inversionIdx = $visibleColumns.length
      for (let i = $visibleColumns.length - 1; i >= 0; i--, inversionIdx--) {
        const rightEdge = $visibleColumns[i].left + $visibleColumns[i].width
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
    rowVerticalInversionIndex,
    columnHorizontalInversionIndex,
  }
}
