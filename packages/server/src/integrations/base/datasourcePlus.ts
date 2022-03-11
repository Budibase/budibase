import { Table } from "../../definitions/common"
import { IntegrationBase } from "./IntegrationBase"

export interface DatasourcePlus extends IntegrationBase {
  tables: Record<string, Table>
  schemaErrors: Record<string, string>

  // if the datasource supports the use of bindings directly (to protect against SQL injection)
  // this returns the format of the identifier
  getBindingIdentifier(): string
  getStringConcat(parts: string[]): string
  buildSchema(datasourceId: string, entities: Record<string, Table>): any
}
