// Pagination only loads more rows while some are still loaded, so deleting
// every loaded row needs a reload from the start. Offset based bookmarks mean
// fetching the next page would skip the rows that shifted down.
export const shouldReloadAfterDelete = ({
  remainingRowCount,
  hasNextPage,
}: {
  remainingRowCount: number
  hasNextPage: boolean
}) => remainingRowCount === 0 && hasNextPage
