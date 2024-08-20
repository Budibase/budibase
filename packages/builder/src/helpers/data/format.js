export const datasourceSelect = {
  table: (table, datasources) => ({
    label: table.name,
    tableId: table._id,
    type: "table",
    datasource: datasources.find(
      datasource => datasource._id === table.sourceId || table.datasourceId
    ),
  }),
  viewV2: view => ({
    ...view,
    label: view.name,
    type: "viewV2",
  }),
}

export const tableSelect = {
  table: table => ({
    type: "table",
    label: table.name,
    tableId: table._id,
    resourceId: table._id,
  }),
  viewV2: view => ({
    type: "viewV2",
    id: view.id,
    label: view.name,
    tableId: view.tableId,
    resourceId: view.id,
  }),
}
