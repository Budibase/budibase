import { cloneDeep } from "lodash/fp"
import { fetchTableData, fetchTableDefinition } from "./tables"
import { fetchViewData } from "./views"
import { fetchRelationshipData } from "./relationships"
import { FieldTypes } from "../constants"
import { executeQuery, fetchQueryDefinition } from "./queries"
import {
  convertJSONSchemaToTableSchema,
  getJSONArrayDatasourceSchema,
} from "builder/src/builderStore/jsonUtils"

/**
 * Fetches all rows for a particular Budibase data source.
 */
export const fetchDatasource = async dataSource => {
  if (!dataSource || !dataSource.type) {
    return []
  }

  // Fetch all rows in data source
  const { type, tableId, fieldName } = dataSource
  let rows = [],
    info = {}
  if (type === "table") {
    rows = await fetchTableData(tableId)
  } else if (type === "view") {
    rows = await fetchViewData(dataSource)
  } else if (type === "query") {
    // Set the default query params
    let parameters = cloneDeep(dataSource.queryParams || {})
    for (let param of dataSource.parameters) {
      if (!parameters[param.name]) {
        parameters[param.name] = param.default
      }
    }
    const { data, ...rest } = await executeQuery({
      queryId: dataSource._id,
      parameters,
    })
    info = rest
    rows = data
  } else if (type === FieldTypes.LINK) {
    rows = await fetchRelationshipData({
      rowId: dataSource.rowId,
      tableId: dataSource.rowTableId,
      fieldName,
    })
  }

  // Enrich the result is always an array
  return { rows: Array.isArray(rows) ? rows : [], info }
}

/**
 * Fetches the schema of any kind of datasource.
 */
export const fetchDatasourceSchema = async dataSource => {
  if (!dataSource) {
    return null
  }
  const { type } = dataSource
  let schema

  // Nested providers should already have exposed their own schema
  if (type === "provider") {
    schema = dataSource.value?.schema
  }

  // Field sources have their schema statically defined
  if (type === "field") {
    if (dataSource.fieldType === "attachment") {
      schema = {
        url: {
          type: "string",
        },
        name: {
          type: "string",
        },
      }
    } else if (dataSource.fieldType === "array") {
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
    const table = await fetchTableDefinition(dataSource.tableId)
    schema = getJSONArrayDatasourceSchema(table?.schema, dataSource)
  }

  // Tables, views and links can be fetched by table ID
  if (
    (type === "table" || type === "view" || type === "link") &&
    dataSource.tableId
  ) {
    const table = await fetchTableDefinition(dataSource.tableId)
    schema = table?.schema
  }

  // Queries can be fetched by query ID
  if (type === "query" && dataSource._id) {
    const definition = await fetchQueryDefinition(dataSource._id)
    schema = definition?.schema
  }

  // Sanity check
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
