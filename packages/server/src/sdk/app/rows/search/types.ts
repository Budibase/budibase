import { Format } from "../../../../api/controllers/view/exporters"
import { SearchFilters, SortOrder } from "@budibase/types"

export interface ExportRowsParams {
  tableId: string
  format: Format
  delimiter?: string
  rowIds?: string[]
  columns?: string[]
  query?: SearchFilters
  sort?: string
  sortOrder?: SortOrder
  customHeaders?: { [key: string]: string }
}

export interface ExportRowsResult {
  fileName: string
  content: string
}
