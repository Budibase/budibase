import sdk from "../../../sdk"

export async function deleteAllForDatasource(datasourceId: string) {
  const allTables = await sdk.tables.getAllTables()
  const tables = allTables.filter(t => t.sourceId === datasourceId)
  for (const table of Object.values(tables)) {
    await sdk.rowActions.deleteAll(table._id!)
  }
}
