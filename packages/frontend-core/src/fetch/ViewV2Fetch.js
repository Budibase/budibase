import DataFetch from "./DataFetch.js"

export default class ViewV2Fetch extends DataFetch {
  determineFeatureFlags() {
    return {
      supportsSearch: true,
      supportsSort: true,
      supportsPagination: true,
    }
  }

  async getSchema(datasource, definition) {
    return definition?.schema
  }

  async getDefinition(datasource) {
    try {
      const table = await this.API.fetchTableDefinition(datasource.tableId)
      return Object.values(table.views || {}).find(
        view => view.id === datasource.id
      )
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
      const res = await this.API.viewV2.fetch(datasource.id)
      return { rows: res?.rows || [] }
    } catch (error) {
      return { rows: [] }
    }
  }
}
