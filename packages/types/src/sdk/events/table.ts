import { BaseEvent, TableExportFormat } from "./event"

export interface TableCreatedEvent extends BaseEvent {
  tableId: string
}

export interface TableUpdatedEvent extends BaseEvent {
  tableId: string
}

export interface TableDeletedEvent extends BaseEvent {
  tableId: string
}

export interface TableExportedEvent extends BaseEvent {
  tableId: string
  format: TableExportFormat
}

export interface TableImportedEvent extends BaseEvent {
  tableId: string
}
