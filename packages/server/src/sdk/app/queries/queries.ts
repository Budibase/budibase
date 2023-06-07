import { getEnvironmentVariables } from "../../utils"
import { processStringSync } from "@budibase/string-templates"

export async function enrichContext(
  fields: Record<string, any>,
  inputs = {}
): Promise<Record<string, any>> {
  const enrichedQuery: Record<string, any> = Array.isArray(fields) ? [] : {}
  if (!fields || !inputs) {
    return enrichedQuery
  }
  const env = await getEnvironmentVariables()
  const parameters = { ...inputs, env }
  // enrich the fields with dynamic parameters
  for (let key of Object.keys(fields)) {
    if (fields[key] == null) {
      continue
    }
    if (typeof fields[key] === "object") {
      // enrich nested fields object
      enrichedQuery[key] = await enrichContext(fields[key], parameters)
    } else if (typeof fields[key] === "string") {
      // enrich string value as normal
      enrichedQuery[key] = processStringSync(fields[key], parameters, {
        noEscaping: true,
        noHelpers: true,
        escapeNewlines: true,
      })
    } else {
      enrichedQuery[key] = fields[key]
    }
  }
  if (
    enrichedQuery.json ||
    enrichedQuery.customData ||
    enrichedQuery.requestBody
  ) {
    try {
      enrichedQuery.json = JSON.parse(
        enrichedQuery.json ||
          enrichedQuery.customData ||
          enrichedQuery.requestBody
      )
    } catch (err) {
      // no json found, ignore
    }
    delete enrichedQuery.customData
  }
  return enrichedQuery
}
