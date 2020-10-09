import api from "./api"

export default async function fetchData(datasource) {
  const { isTable, name } = datasource

  if (name) {
    const rows = isTable ? await fetchTableData() : await fetchViewData()

    // Fetch table schema so we can check for linked rows
    if (rows && rows.length) {
      const table = await fetchTable(rows[0].tableId)
      const keys = Object.keys(table.schema)
      rows.forEach(row => {
        for (let key of keys) {
          if (table.schema[key].type === "link") {
            row[key] = Array.isArray(row[key]) ? row[key].length : 0
          }
        }
      })
    }

    return rows
  }

  async function fetchTable(id) {
    const FETCH_TABLE_URL = `/api/tables/${id}`
    const response = await api.get(FETCH_TABLE_URL)
    return await response.json()
  }

  async function fetchTableData() {
    if (!name.startsWith("all_")) {
      throw new Error("Incorrect table convention - must begin with all_")
    }
    const tablesResponse = await api.get(`/api/views/${name}`)
    return await tablesResponse.json()
  }

  async function fetchViewData() {
    const { field, groupBy } = datasource
    const params = new URLSearchParams()

    if (field) {
      params.set("field", field)
      params.set("stats", true)
    }
    if (groupBy) params.set("group", groupBy)

    let QUERY_VIEW_URL = field
      ? `/api/views/${name}?${params}`
      : `/api/views/${name}`

    const response = await api.get(QUERY_VIEW_URL)
    return await response.json()
  }
}
