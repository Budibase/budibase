import {
  Query,
  ExecuteQueryRequest,
  ExecuteQueryResponse,
  PreviewQueryRequest,
  PreviewQueryResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class QueryAPI extends TestAPI {
  save = async (body: Query): Promise<Query> => {
    return await this._post<Query>(`/api/queries`, { body })
  }

  execute = async (
    queryId: string,
    body?: ExecuteQueryRequest,
    expectations?: Expectations
  ): Promise<ExecuteQueryResponse> => {
    return await this._post<ExecuteQueryResponse>(
      `/api/v2/queries/${queryId}`,
      {
        body,
        expectations,
      }
    )
  }

  previewQuery = async (queryPreview: PreviewQueryRequest) => {
    return await this._post<PreviewQueryResponse>(`/api/queries/preview`, {
      body: queryPreview,
    })
  }
}
