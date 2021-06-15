import api from "builderStore/api"

export async function createUser(user) {
  const CREATE_USER_URL = `/api/users/metadata`
  const response = await api.post(CREATE_USER_URL, user)
  return await response.json()
}

export async function saveRow(row, tableId) {
  const SAVE_ROW_URL = `/api/${tableId}/rows`
  const response = await api.post(SAVE_ROW_URL, row)

  return await response.json()
}

export async function deleteRow(row) {
  const DELETE_ROWS_URL = `/api/${row.tableId}/rows`
  return api.delete(DELETE_ROWS_URL, {
    _id: row._id,
    _rev: row._rev,
  })
}

export async function fetchDataForTable(tableId) {
  const FETCH_ROWS_URL = `/api/${tableId}/rows`

  const response = await api.get(FETCH_ROWS_URL)
  const json = await response.json()

  if (response.status !== 200) {
    throw new Error(json.message)
  }
  return json
}
