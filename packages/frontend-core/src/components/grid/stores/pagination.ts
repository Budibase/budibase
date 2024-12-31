import { derived } from "svelte/store"
import { Store as StoreContext } from "."

export const initialise = (context: StoreContext) => {
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
  const needsNewPage = derived(
    [remainingRows, rowCount],
    ([$remainingRows, $rowCount]) => {
      return $remainingRows < 25 && $rowCount
    }
  )
  needsNewPage.subscribe($needsNewPage => {
    if ($needsNewPage) {
      rows.actions.loadNextPage()
    }
  })
}
