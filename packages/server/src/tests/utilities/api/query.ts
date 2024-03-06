import {
  Query,
  ExecuteQueryRequest,
  ExecuteQueryResponse,
  PreviewQueryRequest,
  PreviewQueryResponse,
} from "@budibase/types"
import { TestAPI } from "./base"

export class QueryAPI extends TestAPI {
  create = async (body: Query): Promise<Query> => {
    return await this._post<Query>(`/api/queries`, { body })
  }

  execute = async (
    queryId: string,
    body?: ExecuteQueryRequest
  ): Promise<ExecuteQueryResponse> => {
    return await this._post<ExecuteQueryResponse>(
      `/api/v2/queries/${queryId}`,
      {
        body,
      }
    )
  }

  previewQuery = async (queryPreview: PreviewQueryRequest) => {
    return await this._post<PreviewQueryResponse>(`/api/queries/preview`, {
      body: queryPreview,
    })
  }
}
