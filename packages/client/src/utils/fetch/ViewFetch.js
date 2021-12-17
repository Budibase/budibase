import DataFetch from "./DataFetch.js"
import { fetchTableDefinition, fetchViewData } from "api"

export default class ViewFetch extends DataFetch {
  static async getSchema(datasource) {
    if (!datasource?.tableId) {
      return null
    }
    const table = await fetchTableDefinition(datasource.tableId)
    return this.enrichSchema(table?.views?.[datasource.name]?.schema)
  }

  async getData() {
    const { datasource } = this.options
    const res = await fetchViewData(datasource)
    return {
      rows: res || [],
    }
  }
}
