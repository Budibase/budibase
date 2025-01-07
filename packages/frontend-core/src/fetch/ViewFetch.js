import DataFetch from "./DataFetch.js"

export default class ViewFetch extends DataFetch {
  getSchema(datasource, definition) {
    return definition?.views?.[datasource.name]?.schema
  }

  async getData() {
    const { datasource } = this.options
    try {
      const res = await this.API.fetchViewData(datasource.name, {
        calculation: datasource.calculation,
        field: datasource.field,
        groupBy: datasource.groupBy,
        tableId: datasource.tableId,
      })
      return { rows: res || [] }
    } catch (error) {
      console.error(error)
      return { rows: [] }
    }
  }
}
