import type {
  BuildFunctionRequest,
  BuildFunctionResponse,
  CompileFunctionRequest,
  CompileFunctionResponse,
  CreateFunctionRequest,
  CreateFunctionResponse,
  FetchFunctionResponse,
  FetchFunctionRunResponse,
  FetchFunctionRunsResponse,
  FetchFunctionQueryCatalogResponse,
  FetchFunctionsResponse,
  UpdateFunctionRequest,
  UpdateFunctionResponse,
} from "@budibase/types"
import { type Expectations, TestAPI } from "./base"

export class FunctionAPI extends TestAPI {
  compile = async (
    body: CompileFunctionRequest,
    expectations?: Expectations
  ) => {
    return await this._post<CompileFunctionResponse>("/api/functions/compile", {
      body,
      expectations,
    })
  }

  build = async (
    id: string,
    body: BuildFunctionRequest,
    expectations?: Expectations
  ) => {
    return await this._post<BuildFunctionResponse>(
      `/api/functions/${id}/build`,
      {
        body,
        expectations,
      }
    )
  }

  queryCatalog = async (expectations?: Expectations) => {
    return await this._get<FetchFunctionQueryCatalogResponse>(
      "/api/functions/query-catalog",
      { expectations }
    )
  }

  fetch = async (expectations?: Expectations) => {
    return await this._get<FetchFunctionsResponse>("/api/functions", {
      expectations,
    })
  }

  create = async (body: CreateFunctionRequest, expectations?: Expectations) => {
    return await this._post<CreateFunctionResponse>("/api/functions", {
      body,
      expectations: {
        status: 201,
        ...expectations,
      },
    })
  }

  find = async (id: string, expectations?: Expectations) => {
    return await this._get<FetchFunctionResponse>(`/api/functions/${id}`, {
      expectations,
    })
  }

  fetchRuns = async (
    id: string,
    query?: { bookmark?: string; limit?: number },
    expectations?: Expectations
  ) => {
    const search = new URLSearchParams()
    if (query?.bookmark) {
      search.set("bookmark", query.bookmark)
    }
    if (query?.limit) {
      search.set("limit", String(query.limit))
    }
    const suffix = search.size ? `?${search}` : ""
    return await this._get<FetchFunctionRunsResponse>(
      `/api/functions/${id}/runs${suffix}`,
      { expectations }
    )
  }

  findRun = async (id: string, runId: string, expectations?: Expectations) => {
    return await this._get<FetchFunctionRunResponse>(
      `/api/functions/${id}/runs/${runId}`,
      { expectations }
    )
  }

  update = async (
    id: string,
    body: UpdateFunctionRequest,
    expectations?: Expectations
  ) => {
    return await this._put<UpdateFunctionResponse>(`/api/functions/${id}`, {
      body,
      expectations,
    })
  }

  delete = async (id: string, rev: string, expectations?: Expectations) => {
    return await this._delete<void>(`/api/functions/${id}/${rev}`, {
      expectations: {
        status: 204,
        ...expectations,
      },
    })
  }
}
