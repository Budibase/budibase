import DataFetch from "./DataFetch.js"
import { fetchViewData } from "api"

export default class ViewFetch extends DataFetch {
  static getSchema(datasource, definition) {
    return definition?.views?.[datasource.name]?.schema
  }

  async getData() {
    const { datasource } = this.options
    const res = await fetchViewData(datasource)
    return {
      rows: res || [],
    }
  }
}
