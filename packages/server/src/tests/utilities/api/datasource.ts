import {
  Datasource,
  VerifyDatasourceRequest,
  CreateDatasourceResponse,
  UpdateDatasourceResponse,
  UpdateDatasourceRequest,
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
}
