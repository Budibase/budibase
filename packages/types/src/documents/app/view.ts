import { SortOrder, SortType } from "../../api"
import { SearchFilters } from "../../sdk"
import { TableSchema, UIFieldMetadata } from "./table"

export interface View {
  name: string
  tableId: string
  field?: string
  filters: ViewFilter[]
  schema: ViewSchema
  calculation?: ViewCalculation
  map?: string
  reduce?: any
  meta?: Record<string, any>
}

export interface ViewV2 {
  version: 2
  id: string
  name: string
  tableId: string
  query?: SearchFilters
  sort?: {
    field: string
    order?: SortOrder
    type?: SortType
  }
  columns?: Record<string, UIFieldMetadata>
}

export type ViewSchema = ViewCountOrSumSchema | ViewStatisticsSchema

export interface ViewCountOrSumSchema {
  field: string
  value: string
}

/**
 e.g:
  "min": {
    "type": "number"
  },
  "max": {
    "type": "number"
  }
 */
export interface ViewStatisticsSchema {
  [key: string]: {
    type: string
  }
}

export interface ViewFilter {
  value?: any
  condition: string
  key: string
  conjunction?: string
}

export enum ViewCalculation {
  SUM = "sum",
  COUNT = "count",
  STATISTICS = "stats",
}
