import { convertJSONSchemaToTableSchema } from "builder/src/builderStore/jsonUtils"
import TableFetch from "./fetch/TableFetch.js"
import ViewFetch from "./fetch/ViewFetch.js"
import QueryFetch from "./fetch/QueryFetch.js"
import RelationshipFetch from "./fetch/RelationshipFetch.js"
import NestedProviderFetch from "./fetch/NestedProviderFetch.js"
import FieldFetch from "./fetch/FieldFetch.js"
import JSONArrayFetch from "./fetch/JSONArrayFetch.js"
import DataFetch from "./fetch/DataFetch.js"

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

  // Get the datasource definition and then schema
  const definition = await handler.getDefinition(datasource)
  let schema = handler.getSchema(datasource, definition)
  if (!schema) {
    return null
  }

  // Check for any JSON fields so we can add any top level properties
  let jsonAdditions = {}
  Object.keys(schema).forEach(fieldKey => {
    const fieldSchema = schema[fieldKey]
    if (fieldSchema?.type === "json") {
      const jsonSchema = convertJSONSchemaToTableSchema(fieldSchema, {
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
  return DataFetch.enrichSchema(schema)
}
