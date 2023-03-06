import { BaseEvent } from "./event"

export interface RowsImportedEvent extends BaseEvent {
  tableId: string
  count: number
}

export interface RowsCreatedEvent extends BaseEvent {
  count: number
}
