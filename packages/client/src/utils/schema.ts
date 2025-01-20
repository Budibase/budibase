import { API } from "api"
import { DataFetchMap, DataFetchType } from "@budibase/frontend-core"

/**
 * Constructs a fetch instance for a given datasource.
 * All datasource fetch classes implement their own functionality to get the
 * schema of a datasource of their respective types.
 * @param datasource the datasource
 * @returns
 */
const getDatasourceFetchInstance = <
  TDatasource extends { type: DataFetchType }
>(
  datasource: TDatasource
) => {
  const handler = DataFetchMap[datasource?.type]
  if (!handler) {
    return null
  }
  return new handler({
    API,
    datasource: datasource as never,
    query: null as any,
  })
}

/**
 * Fetches the schema of any kind of datasource.
 * @param datasource the datasource to fetch the schema for
 * @param options options for enriching the schema
 */
export const fetchDatasourceSchema = async <
  TDatasource extends { type: DataFetchType }
>(
  datasource: TDatasource,
  options = { enrichRelationships: false, formSchema: false }
) => {
  const instance = getDatasourceFetchInstance(datasource)
  const definition = await instance?.getDefinition()
  if (!instance || !definition) {
    return null
  }

  // Get the normal schema as long as we aren't wanting a form schema
  let schema: any
  if (datasource?.type !== "query" || !options?.formSchema) {
    schema = instance.getSchema(definition as any)
  } else if ("parameters" in definition && definition.parameters?.length) {
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
  if (
    definition &&
    "sql" in definition &&
    definition.sql &&
    options?.enrichRelationships
  ) {
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
 * Fetches the definition of any kind of datasource.
 * @param datasource the datasource to fetch the schema for
 */
export const fetchDatasourceDefinition = async <
  TDatasource extends { type: DataFetchType }
>(
  datasource: TDatasource
) => {
  const instance = getDatasourceFetchInstance(datasource)
  return await instance?.getDefinition()
}

/**
 * Fetches the schema of relationship fields for a SQL table schema
 * @param schema the schema to enrich
 */
export const getRelationshipSchemaAdditions = async (
  schema: Record<string, any>
) => {
  if (!schema) {
    return null
  }
  let relationshipAdditions: Record<string, any> = {}
  for (let fieldKey of Object.keys(schema)) {
    const fieldSchema = schema[fieldKey]
    if (fieldSchema?.type === "link") {
      const linkSchema = await fetchDatasourceSchema({
        type: "table",
        tableId: fieldSchema?.tableId,
      })
      if (!linkSchema) {
        continue
      }
      Object.keys(linkSchema).forEach(linkKey => {
        relationshipAdditions[`${fieldKey}.${linkKey}`] = {
          type: linkSchema[linkKey].type,
          externalType: linkSchema[linkKey].externalType,
        }
      })
    }
  }
  return relationshipAdditions
}
