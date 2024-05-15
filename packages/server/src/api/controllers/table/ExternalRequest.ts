import {
  Datasource,
  Operation,
  QueryJson,
  RenameColumn,
  Table,
} from "@budibase/types"
import { makeExternalQuery } from "../../../integrations/base/query"

export async function makeTableRequest(
  datasource: Datasource,
  operation: Operation,
  table: Table,
  tables: Record<string, Table>,
  oldTable?: Table,
  renamed?: RenameColumn
) {
  const json: QueryJson = {
    endpoint: {
      datasourceId: datasource._id!,
      entityId: table._id!,
      operation,
    },
    meta: {
      table,
      tables,
    },
    table,
  }
  if (oldTable) {
    json.meta!.table = oldTable
  }
  if (renamed) {
    json.meta!.renamed = renamed
  }
  return makeExternalQuery(datasource, json)
}
