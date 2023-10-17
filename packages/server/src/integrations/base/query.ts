import { QueryJson, Datasource } from "@budibase/types"
import { getIntegration } from "../index"
import sdk from "../../sdk"

export async function makeExternalQuery(
  datasource: Datasource,
  json: QueryJson
) {
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
