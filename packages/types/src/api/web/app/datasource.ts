import { Datasource } from "../../../documents"

export interface CreateDatasourceResponse {
  datasource: Datasource
  error?: any
}

export interface UpdateDatasourceResponse {
  datasource: Datasource
}

export interface CreateDatasourceRequest {
  datasource: Datasource
  fetchSchema?: boolean
}

export interface VerifyDatasourceRequest {
  datasource: Datasource
}

export interface VerifyDatasourceResponse {
  connected: boolean
  error?: string
}

export interface FetchDatasourceInfoResponse {
  tableNames: string[]
}

export interface UpdateDatasourceRequest extends Datasource {
  datasource: Datasource
}
