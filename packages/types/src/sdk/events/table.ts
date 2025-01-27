import { BaseEvent, TableExportFormat } from "./event"
import { AIOperationEnum } from "../ai"

export interface TableCreatedEvent extends BaseEvent {
  tableId: string
  audited: {
    name: string
  }
}

export interface TableUpdatedEvent extends BaseEvent {
  tableId: string
  defaultValues: boolean | undefined
  aiColumn: AIOperationEnum | undefined
  audited: {
    name: string
  }
}

export interface TableDeletedEvent extends BaseEvent {
  tableId: string
  audited: {
    name: string
  }
}

export interface TableExportedEvent extends BaseEvent {
  tableId: string
  format: TableExportFormat
  audited: {
    name: string
  }
}

export interface TableImportedEvent extends BaseEvent {
  tableId: string
  audited: {
    name: string
  }
}
