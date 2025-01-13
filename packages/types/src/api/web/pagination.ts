export enum SortOrder {
  ASCENDING = "ascending",
  DESCENDING = "descending",
}

export enum SortType {
  STRING = "string",
  NUMBER = "number",
}

export interface BasicPaginationRequest {
  bookmark?: string
}

export interface PaginationRequest extends BasicPaginationRequest {
  limit?: number
  sort?: {
    order: SortOrder
    column: string
    type: SortType
  }
}

export interface PaginationResponse {
  bookmark: string | number | undefined
  hasNextPage?: boolean
  totalRows?: number
}
