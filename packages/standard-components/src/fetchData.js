import api from "./api"

export default async function fetchData(datasource, store) {
  const { type, name } = datasource

  if (name) {
    let rows = []
    if (type === "table") {
      rows = await fetchTableData()
    } else if (type === "view") {
      rows = await fetchViewData()
    } else if (type === "link") {
      rows = await fetchLinkedRowsData()
    }

    // Fetch table schema so we can check for linked rows
    if (rows && rows.length) {
      const schema = await fetchSchema(datasource.tableId)
      const keys = Object.keys(schema)
      rows.forEach(row => {
        for (let key of keys) {
          const type = schema[key].type
          if (type === "link") {
            row[`${key}_count`] = Array.isArray(row[key]) ? row[key].length : 0
          } else if (type === "attachment") {
            let url = null
            if (Array.isArray(row[key]) && row[key][0] != null) {
              url = row[key][0].url
            }
            row[`${key}_first`] = url
          }
        }
      })
    }

    return rows
  } else {
    return []
  }

  async function fetchTableData() {
    if (!name.startsWith("all_")) {
      throw new Error("Incorrect table convention - must begin with all_")
    }
    const tablesResponse = await api.get(`/api/views/${name}`)
    return await tablesResponse.json()
  }

  async function fetchViewData() {
    const { field, groupBy, calculation } = datasource
    const params = new URLSearchParams()

    if (calculation) {
      params.set("field", field)
      params.set("calculation", calculation)
    }

    if (groupBy) {
      params.set("group", groupBy)
    }

    if (groupBy) params.set("group", groupBy)

    let QUERY_VIEW_URL = field
      ? `/api/views/${name}?${params}`
      : `/api/views/${name}`

    const response = await api.get(QUERY_VIEW_URL)
    return await response.json()
  }

  async function fetchLinkedRowsData() {
    if (!store || !store.data || !store.data._id) {
      return []
    }
    const QUERY_URL = `/api/${store.data.tableId}/${store.data._id}/enrich`
    const response = await api.get(QUERY_URL)
    const row = await response.json()
    return row[datasource.fieldName]
  }
}

export async function fetchSchema(id) {
  const FETCH_TABLE_URL = `/api/tables/${id}`
  const response = await api.get(FETCH_TABLE_URL)
  return (await response.json()).schema
}
