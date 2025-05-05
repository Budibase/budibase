import * as format from "@/helpers/data/format"
import { Datasource, Table, ViewV2 } from "@budibase/types"

export type SourceOption = TableOption | ViewOption

type TableOption = ReturnType<typeof makeTableOption>
type ViewOption = ReturnType<typeof makeViewOption>

export const makeViewOption = (view: ViewV2) => ({
  icon: "Remove",
  name: view.name,
  id: view.id,
  tableSelectFormat: format.tableSelect.viewV2(view),
  datasourceSelectFormat: format.datasourceSelect.viewV2(view),
})

export const makeTableOption = (
  table: Table,
  datasources: Omit<Datasource, "entities">[]
) => ({
  icon: "Table",
  name: table.name,
  id: table._id!,
  tableSelectFormat: format.tableSelect.table(table),
  datasourceSelectFormat: format.datasourceSelect.table(table, datasources),
})
