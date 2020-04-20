import api from "builderStore/api"
import { getNewRecord, getNewInstance } from "components/common/core"

export async function createUser(password, user, { appname, instanceId }) {
  const CREATE_USER_URL = `/_builder/instance/${appname}/${instanceId}/api/createUser`
  const response = await api.post(CREATE_USER_URL, { user, password })
  return await response.json()
}

export async function createDatabase(appname, instanceName) {
  const CREATE_DATABASE_URL = `/_builder/instance/_master/0/api/record/`
  const database = getNewInstance(appname, instanceName)
  const response = await api.post(CREATE_DATABASE_URL, database)
  return await response.json()
}

export async function deleteRecord(record, instanceId) {
  const DELETE_RECORDS_URL = `/api/${instanceId}/records/${record._id}/${record._rev}`
  const response = await api.delete(DELETE_RECORDS_URL)
  return response
}

export async function loadRecord(key, { appname, instanceId }) {
  const LOAD_RECORDS_URL = `/_builder/instance/${appname}/${instanceId}/api/record${key}`
  const response = await api.get(LOAD_RECORDS_URL)
  return await response.json()
}

export async function saveRecord({ record, instanceId, modelId }) {
  const SAVE_RECORDS_URL = `/api/${instanceId}/${modelId}/records`
  const response = await api.post(SAVE_RECORDS_URL, record)
  return await response.json()
}

export async function fetchDataForView(viewName, instanceId) {
  // const FETCH_RECORDS_URL = `/_builder/instance/${appname}/${instanceId}/api/listRecords/${viewName}`
  const FETCH_RECORDS_URL = `/api/${instanceId}/${viewName}/records`

  const response = await api.get(FETCH_RECORDS_URL)
  return await response.json()
}