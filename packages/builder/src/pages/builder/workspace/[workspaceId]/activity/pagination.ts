export const getPaginationLabel = ({
  page,
  pageSize,
  rowCount,
  total,
}: {
  page: number
  pageSize: number
  rowCount: number
  total: number
}) => {
  if (!rowCount) {
    return "Showing 0 items"
  }

  const start = (page - 1) * pageSize + 1
  const end = start + rowCount - 1
  return `Showing ${start}–${end} of ${total} items`
}
