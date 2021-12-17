import TableFetch from "./TableFetch.js"
import { fetchRelationshipData } from "api"

export default class ViewFetch extends TableFetch {
  SupportsSearch = false
  SupportsSort = false
  SupportsPagination = false

  /**
   * Fetches a single page of data from the remote resource
   */
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
