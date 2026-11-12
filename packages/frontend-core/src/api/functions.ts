import type {
  BuildFunctionResponse,
  CompileFunctionRequest,
  CompileFunctionResponse,
  CreateFunctionRequest,
  CreateFunctionResponse,
  FetchFunctionResponse,
  FetchFunctionQueryCatalogResponse,
  FetchFunctionRunResponse,
  FetchFunctionRunsResponse,
  FetchFunctionsResponse,
  UpdateFunctionRequest,
  UpdateFunctionResponse,
} from "@budibase/types"
import type { BaseAPIClient } from "./types"

export interface FunctionEndpoints {
  getFunctions: () => Promise<FetchFunctionsResponse>
  getFunctionQueryCatalog: () => Promise<FetchFunctionQueryCatalogResponse>
  getFunction: (functionId: string) => Promise<FetchFunctionResponse>
  getFunctionRuns: (
    functionId: string,
    options?: { bookmark?: string; limit?: number }
  ) => Promise<FetchFunctionRunsResponse>
  getFunctionRun: (
    functionId: string,
    runId: string
  ) => Promise<FetchFunctionRunResponse>
  compileFunction: (
    fn: CompileFunctionRequest
  ) => Promise<CompileFunctionResponse>
  buildFunction: (
    functionId: string,
    revision: string
  ) => Promise<BuildFunctionResponse>
  createFunction: (fn: CreateFunctionRequest) => Promise<CreateFunctionResponse>
  updateFunction: (
    functionId: string,
    fn: UpdateFunctionRequest
  ) => Promise<UpdateFunctionResponse>
  deleteFunction: (functionId: string, revision: string) => Promise<void>
}

export const buildFunctionEndpoints = (
  API: BaseAPIClient
): FunctionEndpoints => ({
  getFunctions: async () => {
    return await API.get({
      url: "/api/functions",
    })
  },

  getFunctionQueryCatalog: async () => {
    return await API.get({
      url: "/api/functions/query-catalog",
    })
  },

  getFunction: async functionId => {
    return await API.get({
      url: `/api/functions/${functionId}`,
    })
  },

  getFunctionRuns: async (functionId, options = {}) => {
    const params = new URLSearchParams()
    if (options.bookmark) {
      params.set("bookmark", options.bookmark)
    }
    if (options.limit !== undefined) {
      params.set("limit", String(options.limit))
    }
    const query = params.toString()
    return await API.get({
      url: `/api/functions/${functionId}/runs${query ? `?${query}` : ""}`,
    })
  },

  getFunctionRun: async (functionId, runId) => {
    return await API.get({
      url: `/api/functions/${functionId}/runs/${runId}`,
    })
  },

  compileFunction: async fn => {
    return await API.post({
      url: "/api/functions/compile",
      body: fn,
    })
  },

  buildFunction: async (functionId, revision) => {
    return await API.post({
      url: `/api/functions/${functionId}/build`,
      body: { _rev: revision },
    })
  },

  createFunction: async fn => {
    return await API.post({
      url: "/api/functions",
      body: fn,
    })
  },

  updateFunction: async (functionId, fn) => {
    return await API.put({
      url: `/api/functions/${functionId}`,
      body: fn,
    })
  },

  deleteFunction: async (functionId, revision) => {
    await API.delete({
      url: `/api/functions/${functionId}/${revision}`,
    })
  },
})
