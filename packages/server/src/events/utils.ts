import { Table, Row } from "@budibase/types"
import BudibaseEmitter from "./BudibaseEmitter"

type BBEventOpts = {
  emitter: BudibaseEmitter
  eventName: string
  appId: string
  table?: Table
  row?: Row
  metadata?: any
}

interface BBEventTable extends Table {
  tableId?: string
}

type BBEvent = {
  appId: string
  tableId?: string
  row?: Row
  table?: BBEventTable
  id?: string
  revision?: string
  metadata?: any
}

export function rowEmission({
  emitter,
  eventName,
  appId,
  row,
  table,
  metadata,
}: BBEventOpts) {
  let event: BBEvent = {
    row,
    appId,
    tableId: row?.tableId,
  }
  if (table) {
    event.table = table
  }
  event.id = row?._id
  if (row?._rev) {
    event.revision = row._rev
  }
  if (metadata) {
    event.metadata = metadata
  }
  emitter.emit(eventName, event)
}

export function tableEmission({
  emitter,
  eventName,
  appId,
  table,
  metadata,
}: BBEventOpts) {
  const tableId = table?._id
  const inputTable: BBEventTable | undefined = table
  if (inputTable) {
    inputTable.tableId = tableId
  }
  let event: BBEvent = {
    table: inputTable,
    appId,
    tableId: tableId,
  }
  event.id = tableId
  if (table?._rev) {
    event.revision = table._rev
  }
  if (metadata) {
    event.metadata = metadata
  }
  emitter.emit(eventName, event)
}
