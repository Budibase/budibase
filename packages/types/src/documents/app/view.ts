import { LegacyFilter, UISearchFilter, SortOrder, SortType } from "../../api"
import { UIFieldMetadata } from "./table"
import { Document } from "../document"
import { DBView, SearchFilters } from "../../sdk"

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
  groupBy?: string
}

export interface BasicViewFieldMetadata extends UIFieldMetadata {
  readonly?: boolean
  columns?: Record<string, RelationSchemaField>
}

export interface RelationSchemaField extends UIFieldMetadata {
  readonly?: boolean
}

export interface NumericCalculationFieldMetadata
  extends BasicViewFieldMetadata {
  calculationType:
    | CalculationType.MIN
    | CalculationType.MAX
    | CalculationType.SUM
    | CalculationType.AVG
  field: string
}

export interface CountCalculationFieldMetadata extends BasicViewFieldMetadata {
  calculationType: CalculationType.COUNT
  field: string
}

export interface CountDistinctCalculationFieldMetadata
  extends CountCalculationFieldMetadata {
  distinct: true
}

export type ViewCalculationFieldMetadata =
  | NumericCalculationFieldMetadata
  | CountCalculationFieldMetadata
  | CountDistinctCalculationFieldMetadata

export type ViewFieldMetadata =
  | BasicViewFieldMetadata
  | ViewCalculationFieldMetadata

export enum CalculationType {
  SUM = "sum",
  AVG = "avg",
  COUNT = "count",
  MIN = "min",
  MAX = "max",
}

export enum ViewV2Type {
  CALCULATION = "calculation",
}

export interface ViewV2 {
  version: 2
  id: string
  name: string
  type?: ViewV2Type
  primaryDisplay?: string
  tableId: string
  query?: LegacyFilter[] | SearchFilters
  // duplicate to store UI information about filters
  queryUI?: UISearchFilter
  sort?: {
    field: string
    order?: SortOrder
    type?: SortType
  }
  schema?: ViewV2Schema
  rowHeight?: number
}

export interface PublicAPIView extends Omit<ViewV2, "query" | "queryUI"> {
  query?: UISearchFilter
}

export type ViewV2Schema = Record<string, ViewFieldMetadata>

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
