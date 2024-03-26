import {
  Datasource,
  VerifyDatasourceRequest,
  CreateDatasourceResponse,
  UpdateDatasourceResponse,
  UpdateDatasourceRequest,
  QueryJson,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class DatasourceAPI extends TestAPI {
  create = async (
    config: Datasource,
    expectations?: Expectations
  ): Promise<Datasource> => {
    const response = await this._post<CreateDatasourceResponse>(
      `/api/datasources`,
      {
        body: {
          datasource: config,
          tablesFilter: [],
        },
        expectations,
      }
    )
    return response.datasource
  }

  update = async (
    datasource: UpdateDatasourceRequest,
    expectations?: Expectations
  ): Promise<Datasource> => {
    const response = await this._put<UpdateDatasourceResponse>(
      `/api/datasources/${datasource._id}`,
      { body: datasource, expectations }
    )
    return response.datasource
  }

  verify = async (
    data: VerifyDatasourceRequest,
    expectations?: Expectations
  ) => {
    return await this._post(`/api/datasources/verify`, {
      body: data,
      expectations,
    })
  }

  delete = async (datasource: Datasource, expectations?: Expectations) => {
    return await this._delete(
      `/api/datasources/${datasource._id!}/${datasource._rev!}`,
      { expectations }
    )
  }

  get = async (id: string, expectations?: Expectations) => {
    return await this._get<Datasource>(`/api/datasources/${id}`, {
      expectations,
    })
  }

  query = async (query: QueryJson, expectations?: Expectations) => {
    return await this._post<any>(`/api/datasources/query`, {
      body: query,
      expectations,
    })
  }
}
