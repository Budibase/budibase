import { API } from "api"
import { JSONUtils } from "@budibase/frontend-core"
import TableFetch from "@budibase/frontend-core/src/fetch/TableFetch.js"
import ViewFetch from "@budibase/frontend-core/src/fetch/ViewFetch.js"
import QueryFetch from "@budibase/frontend-core/src/fetch/QueryFetch.js"
import RelationshipFetch from "@budibase/frontend-core/src/fetch/RelationshipFetch.js"
import NestedProviderFetch from "@budibase/frontend-core/src/fetch/NestedProviderFetch.js"
import FieldFetch from "@budibase/frontend-core/src/fetch/FieldFetch.js"
import JSONArrayFetch from "@budibase/frontend-core/src/fetch/JSONArrayFetch.js"

/**
 * Fetches the schema of any kind of datasource.
 * All datasource fetch classes implement their own functionality to get the
 * schema of a datasource of their respective types.
 * @param datasource the datasource to fetch the schema for
 * @param options options for enriching the schema
 */
export const fetchDatasourceSchema = async (
  datasource,
  options = { enrichRelationships: false }
) => {
  const handler = {
    table: TableFetch,
    view: ViewFetch,
    query: QueryFetch,
    link: RelationshipFetch,
    provider: NestedProviderFetch,
    field: FieldFetch,
    jsonarray: JSONArrayFetch,
  }[datasource?.type]
  if (!handler) {
    return null
  }
  const instance = new handler({ API })

  // Get the datasource definition and then schema
  const definition = await instance.getDefinition(datasource)
  let schema = instance.getSchema(datasource, definition)
  if (!schema) {
    return null
  }

  // Check for any JSON fields so we can add any top level properties
  let jsonAdditions = {}
  Object.keys(schema).forEach(fieldKey => {
    const fieldSchema = schema[fieldKey]
    if (fieldSchema?.type === "json") {
      const jsonSchema = JSONUtils.convertJSONSchemaToTableSchema(fieldSchema, {
        squashObjects: true,
      })
      Object.keys(jsonSchema).forEach(jsonKey => {
        jsonAdditions[`${fieldKey}.${jsonKey}`] = {
          type: jsonSchema[jsonKey].type,
          nestedJSON: true,
        }
      })
    }
  })
  schema = { ...schema, ...jsonAdditions }

  // Check for any relationship fields if required
  if (options?.enrichRelationships && definition.sql) {
    let relationshipAdditions = {}
    for (let fieldKey of Object.keys(schema)) {
      const fieldSchema = schema[fieldKey]
      if (fieldSchema?.type === "link") {
        const linkSchema = await fetchDatasourceSchema({
          type: "table",
          tableId: fieldSchema?.tableId,
        })
        Object.keys(linkSchema || {}).forEach(linkKey => {
          relationshipAdditions[`${fieldKey}.${linkKey}`] = {
            type: linkSchema[linkKey].type,
          }
        })
      }
    }
    schema = { ...schema, ...relationshipAdditions }
  }

  // Ensure schema structure is correct
  return instance.enrichSchema(schema)
}
