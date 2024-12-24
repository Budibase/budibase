import {
  Row,
  SaveRowRequest,
  SaveTableRequest,
  UIDatasource,
  UpdateViewRequest,
} from "@budibase/types"

interface DatasourceBaseActions<
  TSaveDefinitionRequest = UpdateViewRequest | SaveTableRequest
> {
  saveDefinition: (newDefinition: TSaveDefinitionRequest) => Promise<void>
  addRow: (row: SaveRowRequest) => Promise<Row | void>
  updateRow: (row: SaveRowRequest) => Promise<Row | void>
  deleteRows: (rows: Row[]) => Promise<void>
  getRow: (id: string) => Promise<Row | void>
  isDatasourceValid: (datasource: UIDatasource) => boolean | void
  canUseColumn: (name: string) => boolean | void
}

export interface DatasourceTableActions
  extends DatasourceBaseActions<SaveTableRequest> {}

export interface DatasourceViewActions
  extends DatasourceBaseActions<UpdateViewRequest> {}

export interface DatasourceNonPlusActions
  extends DatasourceBaseActions<never> {}

export type DatasourceActions =
  | DatasourceTableActions & DatasourceViewActions & DatasourceNonPlusActions
