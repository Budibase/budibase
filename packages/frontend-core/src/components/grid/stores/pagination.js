import { derived, get } from "svelte/store"

export const initialise = context => {
  const { scrolledRowCount, rows, visualRowCapacity } = context

  // Derive how many rows we have in total
  const rowCount = derived(rows, $rows => $rows.length, 0)

  // Derive how many rows we have available to scroll
  const remainingRows = derived(
    [scrolledRowCount, rowCount, visualRowCapacity],
    ([$scrolledRowCount, $rowCount, $visualRowCapacity]) => {
      return Math.max(0, $rowCount - $scrolledRowCount - $visualRowCapacity)
    }
  )

  // Fetch next page when fewer than 25 remaining rows to scroll
  remainingRows.subscribe(remaining => {
    if (remaining < 25 && get(rowCount)) {
      rows.actions.loadNextPage()
    }
  })
}
