import {
  DatasourcePlusQueryResponse,
  EnrichedQueryJson,
  QueryJson,
} from "@budibase/types"
import { getIntegration } from "../index"
import sdk from "../../sdk"
import { enrichQueryJson } from "../../sdk/app/rows/utils"

function isEnriched(
  json: QueryJson | EnrichedQueryJson
): json is EnrichedQueryJson {
  return "datasource" in json
}

export async function makeExternalQuery(
  json: QueryJson | EnrichedQueryJson
): Promise<DatasourcePlusQueryResponse> {
  if (!isEnriched(json)) {
    json = await enrichQueryJson(json)
    if (json.datasource) {
      json.datasource = await sdk.datasources.enrich(json.datasource)
    }
  }

  if (!json.datasource) {
    throw new Error("No datasource provided for external query")
  }

  const Integration = await getIntegration(json.datasource.source)

  // query is the opinionated function
  if (!Integration.prototype.query) {
    throw "Datasource does not support query."
  }

  const integration = new Integration(json.datasource.config)
  return integration.query(json)
}
