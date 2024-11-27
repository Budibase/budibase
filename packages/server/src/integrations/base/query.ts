import { DatasourcePlusQueryResponse, QueryJson } from "@budibase/types"
import { getIntegration } from "../index"
import sdk from "../../sdk"
import { enrichQueryJson } from "../../sdk/app/rows/utils"

export async function makeExternalQuery(
  json: QueryJson
): Promise<DatasourcePlusQueryResponse> {
  const enrichedJson = await enrichQueryJson(json)
  if (!enrichedJson.datasource) {
    throw new Error("No datasource provided for external query")
  }

  enrichedJson.datasource = await sdk.datasources.enrich(
    enrichedJson.datasource
  )

  const Integration = await getIntegration(enrichedJson.datasource.source)

  // query is the opinionated function
  if (!Integration.prototype.query) {
    throw "Datasource does not support query."
  }

  const integration = new Integration(enrichedJson.datasource.config)
  return integration.query(enrichedJson)
}
