import { QueryJson } from "../../definitions/datasource"
import { Datasource } from "../../definitions/common"
const { integrations } = require("../index")

const QUERY_START_REGEX = /\d[0-9]*:/g

export async function makeExternalQuery(
  datasource: Datasource,
  json: QueryJson
) {
  const Integration = integrations[datasource.source]
  // query is the opinionated function
  if (Integration.prototype.query) {
    const integration = new Integration(datasource.config)
    return integration.query(json)
  } else {
    throw "Datasource does not support query."
  }
}

export function removeKeyNumbering(key: any): string {
  if (typeof key === "string" && key.match(QUERY_START_REGEX) != null) {
    const parts = key.split(":")
    // remove the number
    parts.shift()
    return parts.join(":")
  } else {
    return key
  }
}
