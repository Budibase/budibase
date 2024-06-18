import { debounce } from "../../../utils/utils"

export const initialise = context => {
  const { visiblePages, rows } = context

  // // Derive how many rows we have in total
  // const renderedRowCount = derived(
  //   renderedRows,
  //   $renderedRows => $renderedRows.length,
  //   0
  // )

  // // Derive how many rows we have available to scroll
  // const remainingRows = derived(
  //   [scrolledRowCount, renderedRowCount, visualRowCapacity],
  //   ([$scrolledRowCount, $renderedRowCount, $visualRowCapacity]) => {
  //     return Math.max(
  //       0,
  //       $renderedRowCount - $scrolledRowCount - $visualRowCapacity
  //     )
  //   }
  // )

  // // Fetch next page when fewer than 25 remaining rows to scroll
  // remainingRows.subscribe(remaining => {
  //   console.log(remaining, "remaining")
  //   if (remaining < 25 && get(renderedRowCount)) {
  //     rows.actions.loadNextPage()
  //   }
  // })

  const loadVisiblePages = async pages => {
    for (let page of pages) {
      if (!rows.actions.hasPage(page)) {
        await rows.actions.loadPage(page)
      }
    }
  }
  const throttledLoadVisiblePages = debounce(loadVisiblePages, 500)

  visiblePages.subscribe(throttledLoadVisiblePages)
}
