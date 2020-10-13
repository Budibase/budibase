import api from "builderStore/api"

export async function createUser(user) {
  const CREATE_USER_URL = `/api/users`
  const response = await api.post(CREATE_USER_URL, user)
  return await response.json()
}

export async function saveRow(row, tableId) {
  const SAVE_ROWS_URL = `/api/${tableId}/rows`
  const response = await api.post(SAVE_ROWS_URL, row)

  return await response.json()
}

export async function deleteRow(row) {
  const DELETE_ROWS_URL = `/api/${row.tableId}/rows/${row._id}/${row._rev}`
  const response = await api.delete(DELETE_ROWS_URL)
  return response
}

export async function fetchDataForView(view) {
  const FETCH_ROWS_URL = `/api/views/${view.name}`

  const response = await api.get(FETCH_ROWS_URL)
  return await response.json()
}
