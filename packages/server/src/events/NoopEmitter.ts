import { EventEmitter } from "events"
import {
  Table,
  Row,
  ContextEmitter,
  EventType,
  UserBindings,
} from "@budibase/types"

export class NoopEmitter extends EventEmitter implements ContextEmitter {
  emitRow(values: {
    eventName: EventType.ROW_SAVE
    appId: string
    row: Row
    table: Table
    user: UserBindings
  }): void
  emitRow(values: {
    eventName: EventType.ROW_UPDATE
    appId: string
    row: Row
    table: Table
    oldRow: Row
    user: UserBindings
  }): void
  emitRow(values: {
    eventName: EventType.ROW_DELETE
    appId: string
    row: Row
    user: UserBindings
  }): void
  emitRow(_values: unknown): void {
    return
  }

  emitTable(_eventName: string, _appId: string, _table?: Table) {
    return
  }
}
