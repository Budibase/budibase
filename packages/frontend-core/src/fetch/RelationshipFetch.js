import DataFetch from "./DataFetch.js"

export default class RelationshipFetch extends DataFetch {
  async getData() {
    const { datasource } = this.options
    if (!datasource?.rowId || !datasource?.rowTableId) {
      return { rows: [] }
    }
    try {
      const res = await this.API.fetchRelationshipData(
        datasource.rowTableId,
        datasource.rowId,
        datasource.fieldName
      )
      return { rows: res }
    } catch (error) {
      return { rows: [] }
    }
  }
}
