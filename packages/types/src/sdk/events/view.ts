import { ViewCalculation, ViewV2Schema, ViewV2Type } from "../../documents"
import { BaseEvent, TableExportFormat } from "./event"
import { LegacyFilter, SortOrder, SortType, UISearchFilter } from "../../api"
import { SearchFilters } from "../search"

export interface ViewCreatedEvent extends BaseEvent {
  name: string
  type?: ViewV2Type
}

export interface ViewUpdatedEvent extends BaseEvent {
  tableId: string
}

export interface ViewDeletedEvent extends BaseEvent {
  tableId: string
}

export interface ViewExportedEvent extends BaseEvent {
  tableId: string
  format: TableExportFormat
}

export interface ViewFilterCreatedEvent extends BaseEvent {
  tableId: string
}

export interface ViewFilterUpdatedEvent extends BaseEvent {
  tableId: string
}

export interface ViewFilterDeletedEvent extends BaseEvent {
  tableId: string
}

export interface ViewCalculationCreatedEvent extends BaseEvent {
  tableId: string
  calculation: ViewCalculation
}

export interface ViewCalculationUpdatedEvent extends BaseEvent {
  tableId: string
  calculation: ViewCalculation
}

export interface ViewCalculationDeletedEvent extends BaseEvent {
  tableId: string
  calculation: ViewCalculation
}
