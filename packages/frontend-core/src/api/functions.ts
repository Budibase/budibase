import type {
  CreateFunctionRequest,
  CreateFunctionResponse,
  FetchFunctionResponse,
  FetchFunctionsResponse,
  UpdateFunctionRequest,
  UpdateFunctionResponse,
} from "@budibase/types"
import type { BaseAPIClient } from "./types"

export interface FunctionEndpoints {
  getFunctions: () => Promise<FetchFunctionsResponse>
  getFunction: (functionId: string) => Promise<FetchFunctionResponse>
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

  getFunction: async functionId => {
    return await API.get({
      url: `/api/functions/${functionId}`,
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
