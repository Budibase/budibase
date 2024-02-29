import { Datasource } from "../../../documents"

export interface CreateDatasourceResponse {
  datasource: Datasource
  errors: Record<string, string>
}

export interface UpdateDatasourceResponse {
  datasource: Datasource
}

export interface CreateDatasourceRequest {
  datasource: Datasource
  fetchSchema?: boolean
  tablesFilter: string[]
}

export interface VerifyDatasourceRequest {
  datasource: Datasource
}

export interface VerifyDatasourceResponse {
  connected: boolean
  error?: string
}

export interface FetchDatasourceInfoRequest {
  datasource: Datasource
}

export interface FetchDatasourceInfoResponse {
  tableNames: string[]
}

export type UpdateDatasourceRequest = Datasource

export interface BuildSchemaFromSourceRequest {
  tablesFilter?: string[]
}

export interface BuildSchemaFromSourceResponse {
  datasource: Datasource
  errors: Record<string, string>
}
