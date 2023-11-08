import { SearchFilter, SortOrder, SortType } from "../../api"
import { UIFieldMetadata } from "./table"
import { Document } from "../document"
import { DBView } from "../../sdk"

export type ViewTemplateOpts = {
  field: string
  tableId: string
  groupBy: string
  filters: ViewFilter[]
  schema: any
  calculation: string
  groupByMulti?: boolean
}

export interface InMemoryView extends Document {
  view: DBView
  name: string
  tableId: string
  groupBy?: string
}

export interface View {
  name?: string
  tableId: string
  field?: string
  filters: ViewFilter[]
  schema: ViewSchema
  calculation?: ViewCalculation
  map?: string
  reduce?: any
  meta?: ViewTemplateOpts
}

export interface ViewV2 {
  version: 2
  id: string
  name: string
  primaryDisplay?: string
  tableId: string
  query?: SearchFilter[]
  sort?: {
    field: string
    order?: SortOrder
    type?: SortType
  }
  schema?: Record<string, UIFieldMetadata>
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
