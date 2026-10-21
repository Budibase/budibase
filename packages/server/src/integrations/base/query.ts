import {
  DatasourcePlusQueryResponse,
  EnrichedQueryJson,
  QueryJson,
} from "@budibase/types"
import sdk from "../../sdk"
import { enrichQueryJson } from "../../sdk/workspace/rows/utils"
import { getIntegration, isDatasourcePlus } from "../index"

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

  const createIntegration = await getIntegration(json.datasource.source)

  const integration = await createIntegration(json.datasource.config)

  if (!isDatasourcePlus(integration)) {
    throw "Datasource does not support query."
  }

  return integration.query(json)
}
