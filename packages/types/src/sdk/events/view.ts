import { CalculationType, ViewCalculation, ViewV2Type } from "../../documents"
import { BaseEvent, TableExportFormat } from "./event"

export interface ViewCreatedEvent extends BaseEvent {
  name: string
  type?: ViewV2Type
  tableId: string
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
  filterGroups: number
}

export interface ViewFilterUpdatedEvent extends BaseEvent {
  tableId: string
  filterGroups: number
}

export interface ViewFilterDeletedEvent extends BaseEvent {
  tableId: string
}

export interface ViewCalculationCreatedEvent extends BaseEvent {
  tableId: string
  calculation: CalculationType
}

export interface ViewCalculationUpdatedEvent extends BaseEvent {
  tableId: string
  calculation: ViewCalculation
}

export interface ViewCalculationDeletedEvent extends BaseEvent {
  tableId: string
  calculation: ViewCalculation
}

export interface ViewJoinCreatedEvent extends BaseEvent {
  tableId: string
}
