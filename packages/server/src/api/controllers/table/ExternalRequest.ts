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
  renamed?: RenameColumn
) {
  const json: QueryJson = {
    endpoint: {
      datasource,
      entityId: table._id!,
      operation,
    },
  }
  if (renamed) {
    if (!json.meta) {
      json.meta = {}
    }
    json.meta.renamed = renamed
  }
  return makeExternalQuery(json)
}
