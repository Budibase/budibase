import api from "./api"
import { fetchTableDefinition } from "./tables"

/**
 * Fetches data about a certain row in a table.
 */
export const fetchRow = async ({ tableId, rowId }) => {
  const row = await api.get({
    url: `/api/${tableId}/rows/${rowId}`,
  })
  return (await enrichRows([row], tableId))[0]
}

/**
 * Creates a row in a table.
 */
export const saveRow = async (params, state) => {
  return await api.post({
    url: `/api/${params.tableId}/rows`,
    body: makeRowRequestBody(params, state),
  })
}

/**
 * Updates a row in a table.
 */
export const updateRow = async (params, state) => {
  const row = makeRowRequestBody(params, state)
  row._id = params._id
  return await api.patch({
    url: `/api/${params.tableId}/rows/${params._id}`,
    body: row,
  })
}

/**
 * Deletes a row from a table.
 */
export const deleteRow = async ({ tableId, rowId, revId }) => {
  return await api.del({
    url: `/api/${tableId}/rows/${rowId}/${revId}`,
  })
}

/**
 * Deletes many rows from a table.
 */
export const deleteRows = async ({ tableId, rows }) => {
  return await api.post({
    url: `/api/${tableId}/rows`,
    body: {
      rows,
      type: "delete",
    },
  })
}

/**
 * Sanitises and parses column types when saving and updating rows.
 */
const makeRowRequestBody = (parameters, state) => {
  // start with the row thats currently in context
  const body = { ...(state.data || {}) }

  // dont send the table
  if (body._table) delete body._table

  // then override with supplied parameters
  if (parameters.fields) {
    for (let fieldName of Object.keys(parameters.fields)) {
      const field = parameters.fields[fieldName]

      // ensure fields sent are of the correct type
      if (field.type === "boolean") {
        if (field.value === "true") body[fieldName] = true
        if (field.value === "false") body[fieldName] = false
      } else if (field.type === "number") {
        const val = parseFloat(field.value)
        if (!isNaN(val)) {
          body[fieldName] = val
        }
      } else if (field.type === "datetime") {
        const date = new Date(field.value)
        if (!isNaN(date.getTime())) {
          body[fieldName] = date.toISOString()
        }
      } else {
        body[fieldName] = field.value
      }
    }
  }

  return body
}

/**
 * Enriches rows which contain certain field types so that they can
 * be properly displayed.
 */
export const enrichRows = async (rows, tableId) => {
  if (rows && rows.length && tableId) {
    // Fetch table schema so we can check column types
    const tableDefinition = await fetchTableDefinition(tableId)
    const schema = tableDefinition && tableDefinition.schema
    if (schema) {
      const keys = Object.keys(schema)
      rows.forEach(row => {
        for (let key of keys) {
          const type = schema[key].type
          if (type === "link") {
            // Enrich row with the count of any relationship fields
            row[`${key}_count`] = Array.isArray(row[key]) ? row[key].length : 0
          } else if (type === "attachment") {
            // Enrich row with the first image URL for any attachment fields
            let url = null
            if (Array.isArray(row[key]) && row[key][0] != null) {
              url = row[key][0].url
            }
            row[`${key}_first`] = url
          }
        }
      })
    }
  }
  return rows
}
