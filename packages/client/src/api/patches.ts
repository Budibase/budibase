import { Constants, APIClient } from "@budibase/frontend-core"
import { FieldTypes } from "../constants"
import { Row, Table } from "@budibase/types"

export const patchAPI = (API: APIClient) => {
  /**
   * Enriches rows which contain certain field types so that they can
   * be properly displayed.
   * The ability to create these bindings has been removed, but they will still
   * exist in client apps to support backwards compatibility.
   */
  const enrichRows = async (rows: Row[], tableId: string) => {
    if (!Array.isArray(rows)) {
      return []
    }
    if (rows.length) {
      const tables: Record<string, Table> = {}
      for (let row of rows) {
        // Fall back to passed in tableId if row doesn't have it specified
        let rowTableId = row.tableId || tableId
        let table = tables[rowTableId]
        if (!table) {
          // Fetch table schema so we can check column types
          table = await API.fetchTableDefinition(rowTableId)
          tables[rowTableId] = table
        }
        const schema = table?.schema
        if (schema) {
          const keys = Object.keys(schema)
          for (let key of keys) {
            const type = schema[key].type
            if (type === FieldTypes.LINK && Array.isArray(row[key])) {
              // Enrich row a string join of relationship fields
              row[`${key}_text`] =
                row[key]
                  ?.map(option => option?.primaryDisplay)
                  .filter(option => !!option)
                  .join(", ") || ""
            } else if (type === "attachment") {
              // Enrich row with the first image URL for any attachment fields
              let url = null
              if (Array.isArray(row[key]) && row[key][0] != null) {
                url = row[key][0].url
              }
              row[`${key}_first`] = url
            }
          }
        }
      }
    }
    return rows
  }

  // Enrich rows so they properly handle client bindings
  const fetchSelf = API.fetchSelf
  API.fetchSelf = async () => {
    const user = await fetchSelf()
    if (user && "_id" in user && user._id) {
      if (user.roleId === "PUBLIC") {
        // Don't try to enrich a public user as it will 403
        return user
      } else {
        return (await enrichRows([user], Constants.TableNames.USERS))[0]
      }
    } else {
      return null
    }
  }
  const fetchRelationshipData = API.fetchRelationshipData
  API.fetchRelationshipData = async (sourceId, rowId, fieldName) => {
    const rows = await fetchRelationshipData(sourceId, rowId, fieldName)
    return await enrichRows(rows, sourceId)
  }
  const fetchTableData = API.fetchTableData
  API.fetchTableData = async tableId => {
    const rows = await fetchTableData(tableId)
    return await enrichRows(rows, tableId)
  }
  const searchTable = API.searchTable
  API.searchTable = async (sourceId, opts) => {
    const output = await searchTable(sourceId, opts)
    return {
      ...output,
      rows: await enrichRows(output.rows, sourceId),
    }
  }
  const fetchViewData = API.fetchViewData
  API.fetchViewData = async (viewName, params) => {
    const tableId = params?.tableId
    const rows = await fetchViewData(viewName, params)
    return await enrichRows(rows, tableId)
  }

  // Wipe any HBS formulas from table definitions, as these interfere with
  // handlebars enrichment
  const fetchTableDefinition = API.fetchTableDefinition
  API.fetchTableDefinition = async tableId => {
    const definition = await fetchTableDefinition(tableId)
    Object.keys(definition?.schema || {}).forEach(field => {
      if (definition.schema[field]?.type === "formula") {
        // @ts-expect-error TODO check what use case removing that would break
        delete definition.schema[field].formula
      }
    })
    return definition
  }
}
