import DataFetch from "./DataFetch.js"
import { fetchViewData } from "api"

export default class ViewFetch extends DataFetch {
  static async getSchema(datasource, definition) {
    const schema = definition?.views?.[datasource.name]?.schema
    console.log(schema)
    return schema
  }

  async getData() {
    const { datasource } = this.options
    const res = await fetchViewData(datasource)
    console.log(res)
    return {
      rows: res || [],
    }
  }
}
