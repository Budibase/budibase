export const datasourceSelect = {
  table: (table, datasources) => {
    const sourceId = table.sourceId || table.datasourceId
    const datasource = datasources.find(ds => ds._id === sourceId)
    return {
      label: table.name,
      tableId: table._id,
      type: "table",
      datasourceName: datasource?.name,
    }
  },
  viewV2: (view, datasources) => {
    const datasource = datasources
      .filter(f => f.entities)
      .flatMap(d => d.entities)
      .find(ds => ds._id === view.tableId)
    return {
      ...view,
      label: view.name,
      type: "viewV2",
      datasourceName: datasource?.name,
    }
  },
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
