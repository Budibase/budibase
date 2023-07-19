import { get } from "svelte/store"
import { views as viewsStore } from "stores/backend"
import DataFetch from "./DataFetch.js"

export default class ViewV2Fetch extends DataFetch {
  async getSchema(datasource, definition) {
    return definition.schema
  }

  async getDefinition(datasource) {
    try {
      const views = get(viewsStore).list
      const { tableId } = views.find(v => v.id === datasource.tableId)
      const result = await this.API.fetchTableDefinition(tableId)
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
      const res = await this.API.viewV2.fetch(datasource.tableId)
      return { rows: res?.rows || [] }
    } catch (error) {
      return { rows: [] }
    }
  }
}
