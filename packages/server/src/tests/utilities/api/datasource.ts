import {
  Datasource,
  VerifyDatasourceRequest,
  CreateDatasourceResponse,
  UpdateDatasourceResponse,
  UpdateDatasourceRequest,
  QueryJson,
  BuildSchemaFromSourceResponse,
  FetchDatasourceInfoResponse,
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

  fetch = async (expectations?: Expectations) => {
    return await this._get<Datasource[]>(`/api/datasources`, { expectations })
  }

  query = async (
    query: Omit<QueryJson, "meta"> & Partial<Pick<QueryJson, "meta">>,
    expectations?: Expectations
  ) => {
    return await this._post<any>(`/api/datasources/query`, {
      body: query,
      expectations,
    })
  }

  fetchSchema = async (
    {
      datasourceId,
      tablesFilter,
    }: { datasourceId: string; tablesFilter?: string[] },
    expectations?: Expectations
  ) => {
    return await this._post<BuildSchemaFromSourceResponse>(
      `/api/datasources/${datasourceId}/schema`,
      {
        expectations: expectations,
        body: {
          tablesFilter: tablesFilter,
        },
      }
    )
  }

  info = async (datasource: Datasource, expectations?: Expectations) => {
    return await this._post<FetchDatasourceInfoResponse>(
      `/api/datasources/info`,
      {
        body: { datasource },
        expectations,
      }
    )
  }
}
