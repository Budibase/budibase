import TableFetch from "./TableFetch.js"
import { executeQuery, fetchQueryDefinition } from "api"
import { cloneDeep } from "lodash/fp.js"

export default class ViewFetch extends TableFetch {
  SupportsSearch = false
  SupportsSort = false
  SupportsPagination = false

  /**
   * Fetches the schema for a view
   * @param datasource the view datasource config
   * @return {object} the view schema
   */
  static async getSchema(datasource) {
    if (!datasource?._id) {
      return null
    }
    const definition = await fetchQueryDefinition(datasource._id)
    return this.enrichSchema(definition?.schema)
  }

  /**
   * Fetches a single page of data from the remote resource
   */
  async getData() {
    const { datasource } = this.options

    // Set the default query params
    let parameters = cloneDeep(datasource?.queryParams || {})
    for (let param of datasource?.parameters || {}) {
      if (!parameters[param.name]) {
        parameters[param.name] = param.default
      }
    }

    const res = await executeQuery({ queryId: datasource?._id, parameters })
    return {
      rows: res || [],
    }
  }
}
