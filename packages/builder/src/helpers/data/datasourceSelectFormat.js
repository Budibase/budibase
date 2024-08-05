const table = (table, datasources) => ({
  label: table.name,
  tableId: table._id,
  type: "table",
  datasource: datasources.find(
    datasource => datasource._id === table.sourceId || table.datasourceId
  ),
})

const viewV2 = view => ({
  ...view,
  label: view.name,
  type: "viewV2",
})

export default {
  table,
  viewV2,
}
