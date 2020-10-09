import api from "./api"

export default async function fetchData(datasource, _bb) {
  const { type, name } = datasource

  if (name) {
    let records
    if (type === "model") {
      records = await fetchModelData()
    } else if (type === "view") {
      records = await fetchViewData()
    } else if (type === "link") {
      records = await fetchLinkedRecordsData()
    }

    // Fetch model schema so we can check for linked records
    if (records && records.length) {
      const model = await fetchModel(records[0].modelId)
      const keys = Object.keys(model.schema)
      records.forEach(record => {
        for (let key of keys) {
          if (model.schema[key].type === "link") {
            record[key] = Array.isArray(record[key]) ? record[key].length : 0
          }
        }
      })
    }

    return records
  }

  async function fetchModel(id) {
    const FETCH_MODEL_URL = `/api/models/${id}`
    const response = await api.get(FETCH_MODEL_URL)
    return await response.json()
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

  async function fetchLinkedRecordsData() {
    if (
      !_bb.store.state ||
      !_bb.store.state.data ||
      !_bb.store.state.data._id
    ) {
      return []
    }
    const QUERY_URL = `/api/${_bb.store.state.data.modelId}/${_bb.store.state.data._id}/enrich`
    const response = await api.get(QUERY_URL)
    const record = await response.json()
    return record[datasource.fieldName]
  }
}
