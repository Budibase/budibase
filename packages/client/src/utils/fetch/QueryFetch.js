import DataFetch from "./DataFetch.js"
import { executeQuery, fetchQueryDefinition } from "api"
import { cloneDeep } from "lodash/fp"

export default class ViewFetch extends DataFetch {
  static async getSchema(datasource) {
    if (!datasource?._id) {
      return null
    }
    const definition = await fetchQueryDefinition(datasource._id)
    return this.enrichSchema(definition?.schema)
  }

  async getData() {
    const { datasource } = this.options

    // Set the default query params
    let parameters = cloneDeep(datasource?.queryParams || {})
    for (let param of datasource?.parameters || {}) {
      if (!parameters[param.name]) {
        parameters[param.name] = param.default
      }
    }

    const { data, ...rest } = await executeQuery({
      queryId: datasource?._id,
      parameters,
    })
    return {
      rows: data || [],
      info: rest,
    }
  }
}
