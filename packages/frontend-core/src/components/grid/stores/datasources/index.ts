import {
  SaveRowRequest,
  SaveTableRequest,
  UIDatasource,
  UIRow,
  UpdateViewRequest,
} from "@budibase/types"

interface DatasourceBaseActions<
  TSaveDefinitionRequest = UpdateViewRequest | SaveTableRequest
> {
  saveDefinition: (newDefinition: TSaveDefinitionRequest) => Promise<void>
  addRow: (row: SaveRowRequest) => Promise<UIRow | undefined>
  updateRow: (row: SaveRowRequest) => Promise<UIRow | undefined>
  deleteRows: (rows: UIRow[]) => Promise<void>
  getRow: (id: string) => Promise<UIRow | void>
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
