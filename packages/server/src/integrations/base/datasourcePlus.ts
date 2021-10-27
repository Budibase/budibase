import { Table } from "../../definitions/common"

export interface DatasourcePlus {
  tables: Record<string, Table>
  schemaErrors: Record<string, string>

  buildSchema(datasourceId: string, entities: Record<string, Table>): any
}
