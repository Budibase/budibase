import { BaseEvent, RowImportFormat } from "./event"

export interface RowsImportedEvent extends BaseEvent {
  tableId: string
  format: RowImportFormat
  count: number
}

export interface RowsCreatedEvent extends BaseEvent {
  count: number
}
