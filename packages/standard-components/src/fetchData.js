import api from "./api"

export default async function fetchData(datasource) {
  const { isModel, name } = datasource

  if (name) {
    return isModel ? await fetchModelData() : await fetchViewData()
  }

  async function fetchModelData() {
    if (!name.startsWith("all_")) {
      throw new Error("Incorrect model convention - must begin with all_")
    }
    const modelsResponse = await api.get(`/api/views/${name}`)
    return await modelsResponse.json()
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
