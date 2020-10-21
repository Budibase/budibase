import api from "builderStore/api"

let cache = {}

async function fetchTable(id) {
  const FETCH_TABLE_URL = `/api/tables/${id}`
  const response = await api.get(FETCH_TABLE_URL)
  return await response.json()
}

export async function getTable(tableId) {
  if (!tableId) {
    return null
  }
  if (!cache[tableId]) {
    cache[tableId] = fetchTable(tableId)
    cache[tableId] = await cache[tableId]
  }
  return await cache[tableId]
}
