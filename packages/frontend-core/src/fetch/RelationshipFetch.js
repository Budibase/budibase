import DataFetch from "./DataFetch.js"

export default class RelationshipFetch extends DataFetch {
  async getData() {
    const { datasource } = this.options
    try {
      const res = await this.API.fetchRelationshipData({
        rowId: datasource?.rowId,
        tableId: datasource?.rowTableId,
        fieldName: datasource?.fieldName,
      })
      return { rows: res || [] }
    } catch (error) {
      return { rows: [] }
    }
  }
}
