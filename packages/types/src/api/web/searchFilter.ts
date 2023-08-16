import { FieldType } from "../../documents"
import { EmptyFilterOption } from "src/sdk"

export type SearchFilter = {
  operator: keyof SearchQuery
  onEmptyFilter?: EmptyFilterOption
  field: string
  type?: FieldType
  value: any
  externalType?: string
}

export type SearchQuery = {
  allOr?: boolean
  onEmptyFilter?: EmptyFilterOption
  string?: {
    [key: string]: string
  }
  fuzzy?: {
    [key: string]: string
  }
  range?: {
    [key: string]: {
      high: number | string
      low: number | string
    }
  }
  equal?: {
    [key: string]: any
  }
  notEqual?: {
    [key: string]: any
  }
  empty?: {
    [key: string]: any
  }
  notEmpty?: {
    [key: string]: any
  }
  oneOf?: {
    [key: string]: any[]
  }
  contains?: {
    [key: string]: any[]
  }
  notContains?: {
    [key: string]: any[]
  }
  containsAny?: {
    [key: string]: any[]
  }
}

export type SearchQueryFields = Omit<SearchQuery, "allOr">
