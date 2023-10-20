import { API } from "api"
import TableFetch from "@budibase/frontend-core/src/fetch/TableFetch.js"
import ViewFetch from "@budibase/frontend-core/src/fetch/ViewFetch.js"
import QueryFetch from "@budibase/frontend-core/src/fetch/QueryFetch.js"
import RelationshipFetch from "@budibase/frontend-core/src/fetch/RelationshipFetch.js"
import NestedProviderFetch from "@budibase/frontend-core/src/fetch/NestedProviderFetch.js"
import FieldFetch from "@budibase/frontend-core/src/fetch/FieldFetch.js"
import JSONArrayFetch from "@budibase/frontend-core/src/fetch/JSONArrayFetch.js"
import ViewV2Fetch from "@budibase/frontend-core/src/fetch/ViewV2Fetch.js"

/**
 * Fetches the schema of any kind of datasource.
 * All datasource fetch classes implement their own functionality to get the
 * schema of a datasource of their respective types.
 * @param datasource the datasource to fetch the schema for
 * @param options options for enriching the schema
 */
export const fetchDatasourceSchema = async (
  datasource,
  options = { enrichRelationships: false, formSchema: false }
) => {
  const handler = {
    table: TableFetch,
    view: ViewFetch,
    viewV2: ViewV2Fetch,
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

  // Get the normal schema as long as we aren't wanting a form schema
  let schema
  if (datasource?.type !== "query" || !options?.formSchema) {
    schema = instance.getSchema(datasource, definition)
  } else if (definition.parameters?.length) {
    schema = {}
    definition.parameters.forEach(param => {
      schema[param.name] = { ...param, type: "string" }
    })
  }
  if (!schema) {
    return null
  }

  // Strip hidden fields from views
  if (datasource.type === "viewV2") {
    Object.keys(schema).forEach(field => {
      if (!schema[field].visible) {
        delete schema[field]
      }
    })
  }

  // Enrich schema with relationships if required
  if (definition?.sql && options?.enrichRelationships) {
    const relationshipAdditions = await getRelationshipSchemaAdditions(schema)
    schema = {
      ...schema,
      ...relationshipAdditions,
    }
  }

  // Ensure schema is in the correct structure
  return instance.enrichSchema(schema)
}

/**
 * Fetches the schema of relationship fields for a SQL table schema
 * @param schema the schema to enrich
 */
export const getRelationshipSchemaAdditions = async schema => {
  if (!schema) {
    return null
  }
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
          externalType: linkSchema[linkKey].externalType,
        }
      })
    }
  }
  return relationshipAdditions
}
