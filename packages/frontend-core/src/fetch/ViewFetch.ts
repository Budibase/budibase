import { Table, View } from "@budibase/types"
import DataFetch from "./DataFetch"

type ViewV1 = View & { name: string }

export default class ViewFetch extends DataFetch<ViewV1, Table> {
  async getDefinition(datasource: ViewV1) {
    if (!datasource?.tableId) {
      return null
    }
    try {
      return await this.API.fetchTableDefinition(datasource.tableId)
    } catch (error: any) {
      this.store.update(state => ({
        ...state,
        error,
      }))
      return null
    }
  }

  getSchema(datasource: ViewV1, definition: Table) {
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
