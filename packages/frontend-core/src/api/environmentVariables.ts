import {
  CreateEnvironmentVariableRequest,
  GetEnvironmentVariablesResponse,
  StatusEnvironmentVariableResponse,
  UpdateEnvironmentVariableRequest,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface EnvironmentVariableEndpoints {
  checkEnvironmentVariableStatus: () => Promise<StatusEnvironmentVariableResponse>
  fetchEnvironmentVariables: () => Promise<GetEnvironmentVariablesResponse>
  createEnvironmentVariable: (
    data: CreateEnvironmentVariableRequest
  ) => Promise<void>
  deleteEnvironmentVariable: (name: string) => Promise<void>
  updateEnvironmentVariable: (
    name: string,
    data: UpdateEnvironmentVariableRequest
  ) => Promise<void>
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
