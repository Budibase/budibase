import { convertJSONSchemaToTableSchema } from "builder/src/builderStore/jsonUtils"
import TableFetch from "./fetch/TableFetch.js"
import ViewFetch from "./fetch/ViewFetch.js"
import QueryFetch from "./fetch/QueryFetch.js"
import RelationshipFetch from "./fetch/RelationshipFetch.js"
import NestedProviderFetch from "./fetch/NestedProviderFetch.js"
import FieldFetch from "./fetch/FieldFetch.js"
import JSONArrayFetch from "./fetch/JSONArrayFetch.js"

/**
 * Fetches the schema of any kind of datasource.
 * All datasource fetch classes implement their own functionality to get the
 * schema of a datasource of their respective types.
 */
export const fetchDatasourceSchema = async datasource => {
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
  const schema = handler.getSchema(datasource, definition)
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
  return { ...schema, ...jsonAdditions }
}
