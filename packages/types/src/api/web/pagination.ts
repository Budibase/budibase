export enum SortOrder {
  ASCENDING = "ascending",
  DESCENDING = "descending",
}

export enum SortType {
  STRING = "string",
  number = "number",
}

export interface PaginationRequest {
  limit?: number
  bookmark?: string
  sort?: {
    order: SortOrder
    column: string
    type: SortType
  }
}

export interface PaginationResponse {
  bookmark: string
  hasNextPage: boolean
}
