export enum SortOrder {
  ASCENDING = "ascending",
  DESCENDING = "descending",
}

export enum SortType {
  STRING = "string",
  number = "number",
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
  bookmark: string | undefined
  hasNextPage: boolean
}
