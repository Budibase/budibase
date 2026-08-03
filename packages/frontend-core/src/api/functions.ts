import type {
  BuildFunctionResponse,
  CompileFunctionRequest,
  CompileFunctionResponse,
  CreateFunctionRequest,
  CreateFunctionResponse,
  FetchFunctionResponse,
  FetchFunctionQueryCatalogResponse,
  FetchFunctionsResponse,
  UpdateFunctionRequest,
  UpdateFunctionResponse,
} from "@budibase/types"
import type { BaseAPIClient } from "./types"

export interface FunctionEndpoints {
  getFunctions: () => Promise<FetchFunctionsResponse>
  getFunctionQueryCatalog: () => Promise<FetchFunctionQueryCatalogResponse>
  getFunction: (functionId: string) => Promise<FetchFunctionResponse>
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
