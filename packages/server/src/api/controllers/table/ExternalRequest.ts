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
  oldTable?: Table,
  renamed?: RenameColumn
) {
  const json: QueryJson = {
    endpoint: {
      datasourceId: datasource,
      entityId: table,
      operation,
    },
  }
  if (!json.meta) {
    json.meta = {}
  }
  if (oldTable) {
    json.meta.oldTable = oldTable
  }
  if (renamed) {
    json.meta.renamed = renamed
  }
  return makeExternalQuery(json)
}
