import {
  convertJSONSchemaToTableSchema,
  getJSONArrayDatasourceSchema,
} from "builder/src/builderStore/jsonUtils"
import { fetchTableDefinition } from "api"
import TableFetch from "./fetch/TableFetch.js"
import ViewFetch from "./fetch/ViewFetch.js"
import QueryFetch from "./fetch/QueryFetch.js"

/**
 * Fetches the schema of any kind of datasource.
 */
export const fetchDatasourceSchema = async datasource => {
  const type = datasource?.type
  let schema

  // Nested providers should already have exposed their own schema
  if (type === "provider") {
    schema = datasource.value?.schema
  }

  // Field sources have their schema statically defined
  if (type === "field") {
    if (datasource.fieldType === "attachment") {
      schema = {
        url: {
          type: "string",
        },
        name: {
          type: "string",
        },
      }
    } else if (datasource.fieldType === "array") {
      schema = {
        value: {
          type: "string",
        },
      }
    }
  }

  // JSON arrays need their table definitions fetched.
  // We can then extract their schema as a subset of the table schema.
  if (type === "jsonarray") {
    const table = await fetchTableDefinition(datasource.tableId)
    schema = getJSONArrayDatasourceSchema(table?.schema, datasource)
  }

  // All normal datasource schema can use their corresponding implementations
  // in the data fetch classes
  const handler = {
    table: TableFetch,
    link: TableFetch,
    view: ViewFetch,
    query: QueryFetch,
  }[type]
  if (handler) {
    const definition = await handler.getDefinition(datasource)
    schema = handler.getSchema(datasource, definition)
  }

  // Check for any JSON fields so we can add any top level properties
  if (schema) {
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

  return null
}
