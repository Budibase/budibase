import { AllDocsResponse, Document, RowValue } from "@budibase/types"

export function pagination<T extends Document | RowValue>(
  response: AllDocsResponse<T>,
  opts?: { paginate?: boolean; pageSize: number }
): { data: T[]; hasNextPage: boolean; nextPage?: string; totalRows: number } {
  const data = response.rows.map((row: any) => {
    return row.doc ? row.doc : row
  })
  if (!opts?.paginate) {
    return { data, hasNextPage: false, totalRows: response.total_rows }
  }
  const hasNextPage = data.length > opts?.pageSize
  return {
    data: data.slice(0, opts?.pageSize),
    hasNextPage,
    nextPage: hasNextPage ? response.rows[opts?.pageSize]?.key : undefined,
    totalRows: response.total_rows,
  }
}
