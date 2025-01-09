import { Table } from "@budibase/types"
import DataFetch from "./DataFetch"

interface RelationshipDatasource {
  tableId: string
  rowId: string
  rowTableId: string
  fieldName: string
}

export default class RelationshipFetch extends DataFetch<
  RelationshipDatasource,
  Table
> {
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
