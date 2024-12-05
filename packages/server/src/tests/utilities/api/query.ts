import {
  Query,
  ExecuteQueryRequest,
  ExecuteV2QueryResponse,
  PreviewQueryRequest,
  PreviewQueryResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"
import { constants } from "@budibase/backend-core"

export class QueryAPI extends TestAPI {
  save = async (body: Query, expectations?: Expectations): Promise<Query> => {
    return await this._post<Query>(`/api/queries`, { body, expectations })
  }

  execute = async (
    queryId: string,
    body?: ExecuteQueryRequest,
    expectations?: Expectations
  ): Promise<ExecuteV2QueryResponse> => {
    return await this._post<ExecuteV2QueryResponse>(
      `/api/v2/queries/${queryId}`,
      {
        body,
        expectations,
      }
    )
  }

  preview = async (
    queryPreview: PreviewQueryRequest,
    expectations?: Expectations
  ) => {
    return await this._post<PreviewQueryResponse>(`/api/queries/preview`, {
      body: queryPreview,
      expectations,
    })
  }

  delete = async (query: Query, expectations?: Expectations) => {
    return await this._delete(`/api/queries/${query._id!}/${query._rev!}`, {
      expectations,
    })
  }

  get = async (queryId: string, expectations?: Expectations) => {
    return await this._get<Query>(`/api/queries/${queryId}`, { expectations })
  }

  getProd = async (queryId: string, expectations?: Expectations) => {
    return await this._get<Query>(`/api/queries/${queryId}`, {
      expectations,
      headers: {
        [constants.Header.APP_ID]: this.config.getProdAppId(),
      },
    })
  }

  fetch = async (expectations?: Expectations) => {
    return await this._get<Query[]>(`/api/queries`, { expectations })
  }
}
