import { Table } from "../../definitions/common"
import { IntegrationBase } from "./IntegrationBase"

export interface DatasourcePlus extends IntegrationBase {
  tables: Record<string, Table>
  schemaErrors: Record<string, string>

  buildSchema(datasourceId: string, entities: Record<string, Table>): any
}
