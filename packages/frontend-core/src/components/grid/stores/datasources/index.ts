import {
  Row,
  SaveRowRequest,
  SaveTableRequest,
  UIDatasource,
  UpdateViewRequest,
} from "@budibase/types"

export interface DatasourceActions<
  TSaveDefinitionRequest = UpdateViewRequest | SaveTableRequest
> {
  saveDefinition: (newDefinition: TSaveDefinitionRequest) => Promise<void>
  addRow: (row: SaveRowRequest) => Promise<Row>
  updateRow: (row: SaveRowRequest) => Promise<Row>
  deleteRows: (rows: (string | Row)[]) => Promise<void>
  getRow: (id: string) => Promise<Row>
  isDatasourceValid: (datasource: UIDatasource) => boolean
  canUseColumn: (name: string) => boolean
}
