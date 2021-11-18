import { cloneDeep } from "lodash/fp"
import { fetchTableData, fetchTableDefinition } from "./tables"
import { fetchViewData } from "./views"
import { fetchRelationshipData } from "./relationships"
import { FieldTypes } from "../constants"
import { executeQuery, fetchQueryDefinition } from "./queries"

/**
 * Fetches all rows for a particular Budibase data source.
 */
export const fetchDatasource = async dataSource => {
  if (!dataSource || !dataSource.type) {
    return []
  }

  // Fetch all rows in data source
  const { type, tableId, fieldName } = dataSource
  let rows = []
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
    rows = await executeQuery({ queryId: dataSource._id, parameters })
  } else if (type === FieldTypes.LINK) {
    rows = await fetchRelationshipData({
      rowId: dataSource.rowId,
      tableId: dataSource.rowTableId,
      fieldName,
    })
  }

  // Enrich the result is always an array
  return Array.isArray(rows) ? rows : []
}

/**
 * Fetches the schema of any kind of datasource.
 */
export const fetchDatasourceSchema = async dataSource => {
  if (!dataSource) {
    return null
  }
  const { type } = dataSource

  // Nested providers should already have exposed their own schema
  if (type === "provider") {
    return dataSource.value?.schema
  }

  // Field sources have their schema statically defined
  if (type === "field") {
    if (dataSource.fieldType === "attachment") {
      return {
        url: {
          type: "string",
        },
        name: {
          type: "string",
        },
      }
    } else if (dataSource.fieldType === "array") {
      return {
        value: {
          type: "string",
        },
      }
    }
  }

  // Tables, views and links can be fetched by table ID
  if (
    (type === "table" || type === "view" || type === "link") &&
    dataSource.tableId
  ) {
    const table = await fetchTableDefinition(dataSource.tableId)
    return table?.schema
  }

  // Queries can be fetched by query ID
  if (type === "query" && dataSource._id) {
    const definition = await fetchQueryDefinition(dataSource._id)
    return definition?.schema
  }

  return null
}
