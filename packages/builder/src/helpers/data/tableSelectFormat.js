const table = table => ({
  type: "table",
  label: table.name,
  tableId: table._id,
  resourceId: table._id,
})

const viewV2 = view => ({
  type: "viewV2",
  id: view.id,
  label: view.name,
  tableId: view.tableId,
  resourceId: view.id,
})

export default {
  table,
  viewV2,
}
