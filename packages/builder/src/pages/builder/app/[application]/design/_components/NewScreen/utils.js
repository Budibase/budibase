import * as format from "@/helpers/data/format"

export const makeViewOption = view => ({
  icon: "Remove",
  name: view.name,
  id: view.id,
  tableSelectFormat: format.tableSelect.viewV2(view),
  datasourceSelectFormat: format.datasourceSelect.viewV2(view),
})

export const makeTableOption = (table, datasources) => ({
  icon: "Table",
  name: table.name,
  id: table._id,
  tableSelectFormat: format.tableSelect.table(table),
  datasourceSelectFormat: format.datasourceSelect.table(table, datasources),
})
