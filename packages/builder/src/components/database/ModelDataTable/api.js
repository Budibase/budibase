import api from "builderStore/api"

export async function createUser(user, instanceId) {
  const CREATE_USER_URL = `/api/users`
  const response = await api(instanceId).post(CREATE_USER_URL, user)
  return await response.json()
}

export async function createDatabase(appname, instanceName) {
  const CREATE_DATABASE_URL = `/api/${appname}/instances`
  const response = await api.post(CREATE_DATABASE_URL, {
    name: instanceName,
  })
  return await response.json()
}

export async function deleteRecord(record, instanceId) {
  const DELETE_RECORDS_URL = `/api/${record._modelId}/records/${record._id}/${record._rev}`
  const response = await api(instanceId).delete(DELETE_RECORDS_URL)
  return response
}

export async function saveRecord(record, instanceId, modelId) {
  const SAVE_RECORDS_URL = `/api/${modelId}/records`
  const response = await api(instanceId).post(SAVE_RECORDS_URL, record)

  return await response.json()
}

export async function fetchDataForView(viewName, instanceId) {
  const FETCH_RECORDS_URL = `/api/views/${viewName}`

  const response = await api(instanceId).get(FETCH_RECORDS_URL)
  return await response.json()
}
