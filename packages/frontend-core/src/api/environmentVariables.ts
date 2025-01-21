import {
  CreateEnvironmentVariableRequest,
  CreateEnvironmentVariableResponse,
  DeleteEnvironmentVariablesResponse,
  GetEnvironmentVariablesResponse,
  StatusEnvironmentVariableResponse,
  UpdateEnvironmentVariableRequest,
  UpdateEnvironmentVariableResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface EnvironmentVariableEndpoints {
  checkEnvironmentVariableStatus: () => Promise<StatusEnvironmentVariableResponse>
  fetchEnvironmentVariables: () => Promise<GetEnvironmentVariablesResponse>
  createEnvironmentVariable: (
    data: CreateEnvironmentVariableRequest
  ) => Promise<CreateEnvironmentVariableResponse>
  deleteEnvironmentVariable: (
    name: string
  ) => Promise<DeleteEnvironmentVariablesResponse>
  updateEnvironmentVariable: (
    name: string,
    data: UpdateEnvironmentVariableRequest
  ) => Promise<UpdateEnvironmentVariableResponse>
}

export const buildEnvironmentVariableEndpoints = (
  API: BaseAPIClient
): EnvironmentVariableEndpoints => ({
  checkEnvironmentVariableStatus: async () => {
    return await API.get({
      url: `/api/env/variables/status`,
    })
  },
  fetchEnvironmentVariables: async () => {
    return await API.get({
      url: `/api/env/variables`,
      json: false,
    })
  },
  createEnvironmentVariable: async data => {
    return await API.post({
      url: `/api/env/variables`,
      body: data,
    })
  },
  deleteEnvironmentVariable: async name => {
    return await API.delete({
      url: `/api/env/variables/${name}`,
    })
  },
  updateEnvironmentVariable: async (name, data) => {
    return await API.patch({
      url: `/api/env/variables/${name}`,
      body: data,
    })
  },
})
