import TableFetch from "./TableFetch.js"
import { fetchTableDefinition, fetchViewData } from "api"

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
    if (!datasource?.tableId) {
      return null
    }
    const table = await fetchTableDefinition(datasource.tableId)
    return this.enrichSchema(table?.views?.[datasource.name]?.schema)
  }

  /**
   * Fetches a single page of data from the remote resource
   */
  async getData() {
    const { datasource } = this.options
    const res = await fetchViewData(datasource)
    return {
      rows: res || [],
    }
  }
}

ViewFetch.getSchema()
