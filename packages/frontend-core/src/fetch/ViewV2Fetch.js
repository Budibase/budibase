import DataFetch from "./DataFetch.js"

export default class ViewV2Fetch extends DataFetch {
  async getSchema(datasource, definition) {
    return definition.schema
  }

  async getDefinition(datasource) {
    try {
      const result = await this.API.fetchTableDefinition(
        datasource.tableId.tableId
      )
      return result
    } catch (error) {
      this.store.update(state => ({
        ...state,
        error,
      }))
      return null
    }
  }

  async getData() {
    const { datasource } = this.options
    try {
      const res = await this.API.viewV2.fetch(
        datasource.tableId.tableId,
        datasource.tableId.viewId
      )
      return { rows: res?.rows || [] }
    } catch (error) {
      return { rows: [] }
    }
  }
}
