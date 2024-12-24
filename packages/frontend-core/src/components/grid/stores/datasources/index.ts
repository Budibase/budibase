import {
  Row,
  SaveRowRequest,
  SaveTableRequest,
  UIDatasource,
  UITable,
  UIView,
  UpdateViewRequest,
} from "@budibase/types"

interface DatasourceBaseActions<
  TDatasource = UITable | UIView,
  TSaveDefinitionRequest = UpdateViewRequest | SaveTableRequest
> {
  saveDefinition: (newDefinition: TSaveDefinitionRequest) => Promise<void>
  addRow: (row: SaveRowRequest) => Promise<Row | void>
  updateRow: (row: SaveRowRequest) => Promise<Row | void>
  deleteRows: (rows: Row[]) => Promise<void>
  getRow: (id: string) => Promise<Row | void>
  isDatasourceValid: (datasource: TDatasource) => boolean | void
  canUseColumn: (name: string) => boolean | void
}

export interface DatasourceTableActions
  extends DatasourceBaseActions<UITable, SaveTableRequest> {}

export interface DatasourceViewActions
  extends DatasourceBaseActions<UIView, UpdateViewRequest> {}

export interface DatasourceNonPlusActions
  extends DatasourceBaseActions<UIDatasource, never> {}

export type DatasourceActions =
  | DatasourceTableActions & DatasourceViewActions & DatasourceNonPlusActions
