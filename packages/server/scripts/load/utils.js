const fetch = require("node-fetch")
const uuid = require("uuid/v4")

const URL_APP = "http://localhost:10000/api/public/v1/applications"
const URL_TABLE = "http://localhost:10000/api/public/v1/tables"
const URL_SEARCH_TABLE = "http://localhost:10000/api/public/v1/tables/search"

async function request(apiKey, url, method, body, appId = undefined) {
  const headers = {
    "x-budibase-api-key": apiKey,
    "Content-Type": "application/json",
  }
  if (appId) {
    headers["x-budibase-app-id"] = appId
  }
  const res = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
  })
  if (res.status !== 200) {
    throw new Error(await res.text())
  }
  return res
}

exports.createApp = async apiKey => {
  const name = uuid().replace(/-/g, "")
  const body = {
    name,
    url: `/${name}`,
    useTemplate: true,
    templateKey: "app/school-admin-panel",
    templateName: "School Admin Panel",
  }
  const res = await request(apiKey, URL_APP, "POST", body)
  const json = await res.json()
  return json.data
}

exports.getApp = async (apiKey, appId) => {
  const res = await request(apiKey, `${URL_APP}/${appId}`, "GET")
  const json = await res.json()
  return json.data
}
exports.searchApps = async apiKey => {
  const res = await request(apiKey, `${URL_APP}/search`, "POST", {})
  const json = await res.json()
  return json.data
}

exports.deleteApp = async (apiKey, appId) => {
  const res = await request(apiKey, `${URL_APP}/${appId}`, "DELETE")
  return res
}

exports.getTable = async (apiKey, appId, tableName) => {
  const res = await request(apiKey, URL_SEARCH_TABLE, "POST", {}, appId)
  const json = await res.json()
  const table = json.data.find(t => t.name === tableName)
  if (!table) {
    throw `Table '${tableName} not found`
  }
  return table
}

exports.createRow = async (apiKey, appId, table, body) => {
  if (!body) {
    body = {}
    for (let [key, schema] of Object.entries(table.schema)) {
      let fake
      switch (schema.type) {
        default:
        case "string":
          fake = schema.constraints?.inclusion
            ? schema.constraints.inclusion[0]
            : "a"
          break
        case "number":
          fake = 1
          break
      }
      body[key] = fake
    }
  }
  const url = `http://localhost:10000/api/public/v1/tables/${table._id}/rows`
  const res = await request(apiKey, url, "POST", body, appId)
  return (await res.json()).data
}

exports.getRows = async (apiKey, appId, tableId) => {
  const url = `${URL_TABLE}/${tableId}/rows/search`
  const res = await request(apiKey, url, "POST", {}, appId)
  return (await res.json()).data
}

exports.createTable = async (apiKey, appId, config) => {
  const res = await request(apiKey, URL_TABLE, "POST", config, appId)
  const json = await res.json()
  return json.data
}
