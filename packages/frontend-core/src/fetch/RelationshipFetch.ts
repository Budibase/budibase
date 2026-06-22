import { RelationshipDatasource, Table } from "@budibase/types"
import BaseDataFetch from "./DataFetch"

export default class RelationshipFetch extends BaseDataFetch<
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
      try {
        const definition = await this.getDefinition()
        const schema = definition?.schema
        let relatedFieldName: string | undefined
        if (schema) {
          for (const [key, fieldSchema] of Object.entries(schema)) {
            if (
              fieldSchema.type === "link" &&
              fieldSchema.tableId === datasource.rowTableId &&
              fieldSchema.fieldName === datasource.fieldName
            ) {
              relatedFieldName = key
              break
            }
          }
        }
        if (relatedFieldName) {
          const res = await this.API.searchTable(datasource.tableId, {
            query: {
              equal: {
                [relatedFieldName]: datasource.rowId,
              },
            },
          })
          return { rows: res?.rows || [] }
        }
      } catch (fallbackError) {
        // Ignore fallback error
      }
      return { rows: [] }
    }
  }
}
