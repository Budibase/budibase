import DataFetch from "./DataFetch.js"

export default class ViewV2Fetch extends DataFetch {
  async getSchema(datasource, definition) {
    return definition.schema
  }

  async getDefinition(datasource) {
    try {
      const { schema } = await this.API.viewV2.getSchema(datasource.id)
      return { schema }
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
