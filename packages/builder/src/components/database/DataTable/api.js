import api from "builderStore/api"

export async function createUser(user) {
  const CREATE_USER_URL = `/api/users`
  const response = await api.post(CREATE_USER_URL, user)
  return await response.json()
}

export async function saveRecord(record, modelId) {
  const SAVE_RECORDS_URL = `/api/${modelId}/records`
  const response = await api.post(SAVE_RECORDS_URL, record)

  return await response.json()
}

export async function deleteRecord(record) {
  const DELETE_RECORDS_URL = `/api/${record.modelId}/records/${record._id}/${record._rev}`
  const response = await api.delete(DELETE_RECORDS_URL)
  return response
}

export async function fetchDataForView(view) {
  const FETCH_RECORDS_URL = `/api/views/${view.name}`

  const response = await api.get(FETCH_RECORDS_URL)
  return await response.json()
}
