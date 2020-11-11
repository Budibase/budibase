import api from "./api"

/**
 * Creates a row in a table.
 *
 * @param params
 * @param state
 * @returns {Promise<any|{error: *}>}
 */
export const saveRow = async (params, state) => {
  return await api.post({
    url: `/api/${params.tableId}/rows`,
    body: makeRowRequestBody(params, state),
  })
}

/**
 * Updates a row in a table.
 *
 * @param params
 * @param state
 * @returns {Promise<any|{error: *}>}
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
 *
 * @param tableId
 * @param rowId
 * @param revId
 * @returns {Promise<any|{error: *}>}
 */
export const deleteRow = async ({ tableId, rowId, revId }) => {
  return await api.del({
    url: `/api/${tableId}/rows/${rowId}/${revId}`,
  })
}

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
