import { FieldType } from "../../documents"
import { EmptyFilterOption } from "../../sdk"

export type SearchFilter = {
  operator: keyof SearchQuery
  onEmptyFilter?: EmptyFilterOption
  field: string
  type?: FieldType
  value: any
  externalType?: string
}

export enum SearchQueryOperators {
  STRING = "string",
  FUZZY = "fuzzy",
  RANGE = "range",
  EQUAL = "equal",
  NOT_EQUAL = "notEqual",
  EMPTY = "empty",
  NOT_EMPTY = "notEmpty",
  ONE_OF = "oneOf",
  CONTAINS = "contains",
  NOT_CONTAINS = "notContains",
  CONTAINS_ANY = "containsAny",
}

export type SearchQuery = {
  allOr?: boolean
  onEmptyFilter?: EmptyFilterOption
  [SearchQueryOperators.STRING]?: {
    [key: string]: string
  }
  [SearchQueryOperators.FUZZY]?: {
    [key: string]: string
  }
  [SearchQueryOperators.RANGE]?: {
    [key: string]: {
      high: number | string
      low: number | string
    }
  }
  [SearchQueryOperators.EQUAL]?: {
    [key: string]: any
  }
  [SearchQueryOperators.NOT_EQUAL]?: {
    [key: string]: any
  }
  [SearchQueryOperators.EMPTY]?: {
    [key: string]: any
  }
  [SearchQueryOperators.NOT_EMPTY]?: {
    [key: string]: any
  }
  [SearchQueryOperators.ONE_OF]?: {
    [key: string]: any[]
  }
  [SearchQueryOperators.CONTAINS]?: {
    [key: string]: any[]
  }
  [SearchQueryOperators.NOT_CONTAINS]?: {
    [key: string]: any[]
  }
  [SearchQueryOperators.CONTAINS_ANY]?: {
    [key: string]: any[]
  }
}

export type SearchQueryFields = Omit<SearchQuery, "allOr" | "onEmptyFilter">
