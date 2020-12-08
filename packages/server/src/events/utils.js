exports.rowEmission = ({ emitter, eventName, appId, row, table, metadata }) => {
  let event = {
    row,
    appId,
    tableId: row.tableId,
  }
  if (table) {
    event.table = table
  }
  event.id = row._id
  if (row._rev) {
    event.revision = row._rev
  }
  if (metadata) {
    event.metadata = metadata
  }
  emitter.emit(eventName, event)
}

exports.tableEmission = ({ emitter, eventName, appId, table, metadata }) => {
  const tableId = table._id
  let event = {
    table: {
      ...table,
      tableId: tableId,
    },
    appId,
    tableId: tableId,
  }
  event.id = tableId
  if (table._rev) {
    event.revision = table._rev
  }
  if (metadata) {
    event.metadata = metadata
  }
  emitter.emit(eventName, event)
}
