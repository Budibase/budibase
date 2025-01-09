import { Table, View } from "@budibase/types"
import DataFetch from "./DataFetch"

type ViewV1 = View & { name: string }

export default class ViewFetch extends DataFetch<ViewV1, Table> {
  async getDefinition() {
    const { datasource } = this.options

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

  getSchema(definition: Table) {
    const { datasource } = this.options
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
      console.error(error, { datasource })
      return { rows: [] }
    }
  }
}
