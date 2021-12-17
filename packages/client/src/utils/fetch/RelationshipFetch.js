import DataFetch from "./DataFetch.js"
import { fetchRelationshipData } from "api"

export default class RelationshipFetch extends DataFetch {
  async getData() {
    const { datasource } = this.options
    const res = await fetchRelationshipData({
      rowId: datasource?.rowId,
      tableId: datasource?.rowTableId,
      fieldName: datasource?.fieldName,
    })
    return {
      rows: res || [],
    }
  }
}
