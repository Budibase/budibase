import {
  QueryJson,
  Datasource,
  DatasourcePlusQueryResponse,
  RowOperations,
} from "@budibase/types"
import { getIntegration } from "../index"
import sdk from "../../sdk"

export async function makeExternalQuery(
  datasource: Datasource,
  json: QueryJson
): Promise<DatasourcePlusQueryResponse> {
  const entityId = json.endpoint.entityId,
    tableName = json.meta.table.name,
    tableId = json.meta.table._id
  // case found during testing - make sure this doesn't happen again
  if (
    RowOperations.includes(json.endpoint.operation) &&
    entityId !== tableId &&
    entityId !== tableName
  ) {
    throw new Error("Entity ID and table metadata do not align")
  }
  if (!datasource) {
    throw new Error("No datasource provided for external query")
  }
  datasource = await sdk.datasources.enrich(datasource)
  const Integration = await getIntegration(datasource.source)
  // query is the opinionated function
  if (Integration.prototype.query) {
    const integration = new Integration(datasource.config)
    return integration.query(json)
  } else {
    throw "Datasource does not support query."
  }
}
